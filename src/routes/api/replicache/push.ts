/* eslint-disable no-await-in-loop */
import {
  insertMessage,
  selectLastMutationId,
  selectSpaceVersion,
  updateSpaceVersion,
  upsertLastMutationId,
} from "~/server/messages/db";

async function sendPoke() {
  // TODO
}

const processMutation = async (t, clientID, spaceID, mutation, error) => {
  // Get the previous version for the affected space and calculate the next
  // one.
  const preVersion = selectSpaceVersion({
    ctx,
    spaceId: spaceID,
  });

  const nextVersion = (preVersion?.version || 1) + 1;

  const lastMutationID = await selectLastMutationId(t, clientID, false);
  const nextMutationID = lastMutationID + 1;

  console.log("nextVersion", nextVersion, "nextMutationID", nextMutationID);

  // It's common due to connectivity issues for clients to send a
  // mutation which has already been processed. Skip these.
  if (mutation.id < nextMutationID) {
    console.log(
      `Mutation ${mutation.id} has already been processed - skipping`,
    );
    return;
  }

  // If the Replicache client is working correctly, this can never
  // happen. If it does there is nothing to do but return an error to
  // client and report a bug to Replicache.
  if (mutation.id > nextMutationID) {
    throw new Error(`Mutation ${mutation.id} is from the future - aborting`);
  }

  if (error === undefined) {
    console.log("Processing mutation:", JSON.stringify(mutation));

    // For each possible mutation, run the server-side logic to apply the
    // mutation.
    switch (mutation.name) {
      case "createMessage":
        insertMessage({
          content: mutation.args.content,
          ctx,
          from: mutation.args.from,
          id: mutation.args.id,
          order: mutation.args.order,
          spaceId: spaceID,
          version: nextVersion,
        });
        break;
      default:
        throw new Error(`Unknown mutation: ${mutation.name}`);
    }
  } else {
    // TODO: You can store state here in the database to return to clients to
    // provide additional info about errors.
    console.log(
      "Handling error from mutation",
      JSON.stringify(mutation),
      error,
    );
  }

  console.log("setting", clientID, "last_mutation_id to", nextMutationID);
  // Update lastMutationID for requesting client.
  upsertLastMutationId({
    clientId: clientID,
    ctx,
    mutationId: nextMutationID,
  });

  // Update version for space.
  updateSpaceVersion({
    ctx,
    spaceId: spaceID,
    version: nextVersion,
  });
};

const resolver = async (req, res) => {
  const push = req.body;
  console.log("Processing push", JSON.stringify(push));

  const t0 = Date.now();
  try {
    // Iterate each mutation in the push.
    for (const mutation of push.mutations) {
      const t1 = Date.now();

      try {
        await processMutation(t, push.clientID, defaultSpaceID, mutation);
      } catch (e) {
        console.error("Caught error from mutation", mutation, e);

        // Handle errors inside mutations by skipping and moving on. This is
        // convenient in development but you may want to reconsider as your app
        // gets close to production:
        //
        // https://doc.replicache.dev/server-push#error-handling
        //
        // Ideally we would run the mutator itself in a nested transaction, and
        // if that fails, rollback just the mutator and allow the lmid and
        // version updates to commit. However, nested transaction support in
        // Postgres is not great:
        //
        // https://postgres.ai/blog/20210831-postgresql-subtransactions-considered-harmful
        //
        // Instead we implement skipping of failed mutations by *re-runing*
        // them, but passing a flag that causes the mutator logic to be skipped.
        //
        // This ensures that the lmid and version bookkeeping works exactly the
        // same way as in the happy path. A way to look at this is that for the
        // error-case we replay the mutation but it just does something
        // different the second time.
        //
        // This is allowed in Replicache because mutators don't have to be
        // deterministic!:
        //
        // https://doc.replicache.dev/concepts/how-it-works#speculative-execution-and-confirmation
        processMutation(t, push.clientID, defaultSpaceID, mutation, e);
      }

      console.log("Processed mutation in", Date.now() - t1);
    }

    res.send("{}");

    // We need to await here otherwise, Next.js will frequently kill the request
    // and the poke won't get sent.
    await sendPoke();
  } catch (e) {
    console.error(e);
    res.status(500).send(e.toString());
  } finally {
    console.log("Processed push in", Date.now() - t0);
  }
};

export const POST = resolver;
export const GET = resolver;

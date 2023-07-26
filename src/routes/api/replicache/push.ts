/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-await-in-loop */
import { ServerError, json, type APIEvent } from "solid-start";
import { getRequestContext, type RequestContext } from "~/server/context";
import {
  insertMessage,
  selectLastMutationId,
  selectSpaceVersion,
  updateSpaceVersion,
  upsertLastMutationId,
} from "~/server/messages/db";

const defaultSpaceId = "0";

async function sendPoke() {
  // TODO
}

type ProcessMutationArgs = {
  clientId: string;
  ctx: RequestContext;
  error?: any;
  mutation: any;
  spaceId: string;
};

const processMutation = ({
  clientId,
  ctx,
  error,
  mutation,
  spaceId,
}: ProcessMutationArgs) => {
  // Get the previous version for the affected space and calculate the next
  // one.
  const preVersion = selectSpaceVersion({
    ctx,
    spaceId: spaceId,
  });

  const nextVersion = (preVersion?.version || 1) + 1;

  const lastMutationID = selectLastMutationId({
    clientId,
    ctx,
    required: false,
  });
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
          spaceId: spaceId,
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

  console.log("setting", clientId, "last_mutation_id to", nextMutationID);
  // Update lastMutationID for requesting client.
  upsertLastMutationId({
    clientId: clientId,
    ctx,
    mutationId: nextMutationID,
  });

  // Update version for space.
  updateSpaceVersion({
    ctx,
    spaceId: spaceId,
    version: nextVersion,
  });
};

const resolver = async (event: APIEvent) => {
  const ctx = await getRequestContext(event);

  const push = await event.request.json();
  console.log("Processing push", JSON.stringify(push));

  const t0 = Date.now();
  try {
    // Iterate each mutation in the push.
    for (const mutation of push.mutations) {
      const t1 = Date.now();

      try {
        processMutation({
          clientId: push.clientID,
          ctx,
          mutation,
          spaceId: defaultSpaceId,
        });
      } catch (error) {
        console.error("Caught error from mutation", mutation, error);

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
        processMutation({
          clientId: push.clientID,
          ctx,
          error,
          mutation,
          spaceId: defaultSpaceId,
        });
      }

      console.log("Processed mutation in", Date.now() - t1);
    }

    // res.send("{}");

    // We need to await here otherwise, Next.js will frequently kill the request
    // and the poke won't get sent.
    await sendPoke();

    return json({});
  } catch (error) {
    console.error(error);
    throw new ServerError(String(error), { status: 500 });
    // res.status(500).send(String(error));
  } finally {
    console.log("Processed push in", Date.now() - t0);
  }
};

export const POST = resolver;
export const GET = resolver;

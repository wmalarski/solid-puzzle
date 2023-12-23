import { createClient } from "@supabase/supabase-js";
import { createEffect, onCleanup, type Component } from "solid-js";
import { object, parse, string } from "valibot";

const createSupabaseClient = () => {
  const schema = object({ key: string(), url: string() });
  const parsed = parse(schema, {
    key: import.meta.env.VITE_SUPABASE_ANON_KEY,
    url: import.meta.env.VITE_SUPABASE_URL,
  });

  return createClient(parsed.url, parsed.key);
};

type Props = {
  boardId: string;
};

const RealtimeProvider: Component<Props> = (props) => {
  const supabase = createSupabaseClient();

  createEffect(() => {
    const channel = supabase.channel(props.boardId);

    const subscription = channel
      .on("presence", { event: "sync" }, () => {
        const newState = channel.presenceState();
        console.log("sync", newState);
      })
      .on(
        "presence",
        { event: "join" },
        ({ currentPresences, event, key, newPresences }) => {
          console.log("join", { currentPresences, event, key, newPresences });
        },
      )
      .on(
        "presence",
        { event: "leave" },
        ({ currentPresences, event, key, leftPresences }) => {
          console.log("leave", { currentPresences, event, key, leftPresences });
        },
      )
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          const presenceTrackStatus = await channel.track({
            online_at: new Date().toISOString(),
            user: "user-1",
          });
          console.log(presenceTrackStatus);
        }
      });

    onCleanup(() => {
      subscription.unsubscribe();

      const untrackPresence = async () => {
        const presenceUntrackStatus = await channel.untrack();
        console.log(presenceUntrackStatus);
      };

      untrackPresence();
    });
  });

  return null;
};

export default RealtimeProvider;

import { type Component, createEffect, onCleanup } from "solid-js";

import { useSupabase } from "~/contexts/SupabaseContext";

type Props = {
  boardId: string;
};

export const RealtimeProvider: Component<Props> = (props) => {
  const supabase = useSupabase();

  createEffect(() => {
    const channel = supabase().channel(props.boardId);

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

import { nanoid } from "nanoid";
import { type Component, createEffect, createMemo, onCleanup } from "solid-js";

import type { BoardAccess } from "~/server/share/db";

import { useSessionContext } from "~/contexts/SessionContext";
import { useSupabase } from "~/contexts/SupabaseContext";

type Props = {
  boardAccess: BoardAccess;
};

const defaultUserId = nanoid();

export const RealtimeProvider: Component<Props> = (props) => {
  const supabase = useSupabase();

  const session = useSessionContext();

  const channel = createMemo(() => {
    const boardId = props.boardAccess.boardId;

    return supabase().channel("Room", {
      config: { presence: { key: boardId } },
    });
  });

  createEffect(() => {
    const userId = session()?.userId || defaultUserId;
    const userName = props.boardAccess.username;
    const realtimeChannel = channel();

    const subscription = channel()
      .on("presence", { event: "sync" }, () => {
        const newState = realtimeChannel.presenceState();
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
      .subscribe(async (status, err) => {
        if (status === "SUBSCRIBED") {
          const presenceTrackStatus = await realtimeChannel.track({
            name: userName,
            online_at: new Date().toISOString(),
            user: userId,
          });
          console.log(presenceTrackStatus);
          return;
        }
        console.log(status, err);
      }, 50000);

    onCleanup(() => {
      subscription.unsubscribe();

      const untrackPresence = async () => {
        const presenceUntrackStatus = await realtimeChannel.untrack();
        console.log(presenceUntrackStatus);
      };

      untrackPresence();
    });
  });

  return null;
};

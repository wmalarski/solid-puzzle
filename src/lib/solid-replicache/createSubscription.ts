import type {
  ReadonlyJSONValue,
  ReadTransaction,
  Replicache,
} from "replicache";
import { createEffect, createSignal, onCleanup, type Accessor } from "solid-js";

type Subscribable = Pick<Replicache, "subscribe">;

export const createSubscription = <R extends ReadonlyJSONValue | undefined>(
  rep: Subscribable | null | undefined,
  query: (tx: ReadTransaction) => Promise<R>,
  def: R
): Accessor<R> => {
  const [snapshot, setSnapshot] = createSignal<R>(def);

  createEffect(() => {
    if (!rep) {
      return;
    }

    const unsubscribe = rep.subscribe(query, {
      onData: (data: R) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setSnapshot(data as any);
      },
    });

    onCleanup(() => {
      unsubscribe();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSnapshot(def as any);
    });
  });

  return snapshot;
};

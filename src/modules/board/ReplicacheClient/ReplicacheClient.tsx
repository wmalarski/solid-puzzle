import {
  Replicache,
  type MutatorDefs,
  type WriteTransaction,
} from "replicache";
import {
  createContext,
  createSignal,
  useContext,
  type Component,
  type JSX,
} from "solid-js";

type MutatorDef<T> = (
  tx: WriteTransaction,
  args: T,
) => ReturnType<MutatorDefs[0]>;

export type FragmentState = {
  fragmentId: string;
  isLocked: boolean;
  rotation: number;
  x: number;
  y: number;
};

type GetFragmentKeyArgs = {
  fragmentId: string;
  boardId: string;
};

export const getFragmentKey = ({ fragmentId, boardId }: GetFragmentKeyArgs) => {
  return `board/${boardId}/fragment/${fragmentId}`;
};

type SetFragmentStateArgs = {
  state: FragmentState;
  boardId: string;
};

const setFragmentState: MutatorDef<SetFragmentStateArgs> = async (
  tx,
  { boardId, state },
) => {
  const key = getFragmentKey({ boardId, fragmentId: state.fragmentId });
  await tx.put(key, state);
};

const createReplicache = () => {
  const replicache = new Replicache({
    licenseKey: import.meta.env.VITE_REPLICACHE_LICENSE_KEY,
    mutators: { setFragmentState },
    name: "chat-user-id",
    pullURL: "/api/replicache/pull",
    pushURL: "/api/replicache/push",
  });

  return replicache;
};

type ReplicacheContextValue = typeof createReplicache;

const ReplicacheContext =
  createContext<ReplicacheContextValue>(createReplicache);

type ReplicacheProviderProps = {
  children: JSX.Element;
};

export const ReplicacheProvider: Component<ReplicacheProviderProps> = (
  props,
) => {
  const [value] = createSignal(createReplicache());

  return <ReplicacheContext.Provider value={value} {...props} />;
};

export const useReplicache = () => {
  return useContext(ReplicacheContext);
};

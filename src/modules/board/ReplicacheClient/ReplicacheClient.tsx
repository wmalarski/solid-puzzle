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
  args: T
) => ReturnType<MutatorDefs[0]>;

type SetFragmentRotationArgs = {
  fragmentId: string;
  rotation: number;
  boardId: string;
};

const setFragmentRotation: MutatorDef<SetFragmentRotationArgs> = async (
  tx,
  { boardId, fragmentId, rotation }
) => {
  await tx.put(`board/${boardId}/fragment/${fragmentId}/rotation`, rotation);
};

type SetFragmentPositionArgs = {
  boardId: string;
  fragmentId: string;
  x: number;
  y: number;
};

const setFragmentPosition: MutatorDef<SetFragmentPositionArgs> = async (
  tx,
  { boardId, fragmentId, x, y }
) => {
  await tx.put(`board/${boardId}/fragment/${fragmentId}/position`, { x, y });
};

const createReplicache = () => {
  const replicache = new Replicache({
    licenseKey: import.meta.env.VITE_REPLICACHE_LICENSE_KEY,
    mutators: { setFragmentPosition, setFragmentRotation },
    name: "chat-user-id",
    pullURL: "/api/replicache-pull",
    pushURL: "/api/replicache-push",
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
  props
) => {
  const [value] = createSignal(createReplicache());

  return <ReplicacheContext.Provider value={value} {...props} />;
};

export const useReplicache = () => {
  return useContext(ReplicacheContext);
};

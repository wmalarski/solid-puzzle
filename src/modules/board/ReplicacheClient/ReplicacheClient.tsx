import { Replicache } from "replicache";
import {
  createContext,
  createSignal,
  type Component,
  type JSX,
} from "solid-js";

const createReplicache = () => {
  const replicache = new Replicache({
    licenseKey: import.meta.env.VITE_REPLICACHE_LICENSE_KEY,
    name: "chat-user-id",
    pullURL: "/api/replicache-pull",
    pushURL: "/api/replicache-push",
  });

  return { replicache };
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

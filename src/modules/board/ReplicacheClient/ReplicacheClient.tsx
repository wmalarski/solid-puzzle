import { Replicache } from "replicache";
import type { Component } from "solid-js";
import { ClientOnly } from "~/components/ClientOnly";

const ReplicacheClientOnly: Component = () => {
  const rep = new Replicache({
    licenseKey: import.meta.env.VITE_REPLICACHE_LICENSE_KEY,
    name: "chat-user-id",
    pullURL: "/api/replicache-pull",
    pushURL: "/api/replicache-push",
  });

  return null;
};

export const ReplicacheProvider: Component = () => {
  return (
    <ClientOnly>
      <ReplicacheClientOnly />
    </ClientOnly>
  );
};

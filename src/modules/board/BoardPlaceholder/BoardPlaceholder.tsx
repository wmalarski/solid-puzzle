import type { Component } from "solid-js";

import { Skeleton } from "~/components/Skeleton";

export const BoardPlaceholder: Component = () => {
  return (
    <div class="h-screen w-screen p-6">
      <Skeleton class="size-full" />
    </div>
  );
};

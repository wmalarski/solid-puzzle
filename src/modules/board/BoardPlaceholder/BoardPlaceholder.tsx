import { Skeleton } from "~/components/Skeleton";

export function BoardPlaceholder() {
  return (
    <div class="h-screen w-screen p-6">
      <Skeleton class="size-full" />
    </div>
  );
}

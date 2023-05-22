import { Show, Suspense, createSignal, lazy, type Component } from "solid-js";
import { ClientOnly } from "~/components/ClientOnly";

const PixiStage = lazy(() => import("../PixiStage/PixiStage"));

const ClientBoard: Component = () => {
  const [container, setContainer] = createSignal<HTMLDivElement>();

  return (
    <>
      <div ref={setContainer} class="grow" />
      <Show when={container()}>
        {(element) => (
          <Suspense>
            <PixiStage container={element()} />
          </Suspense>
        )}
      </Show>
    </>
  );
};
export const Board: Component = () => {
  return (
    <ClientOnly>
      <ClientBoard />
    </ClientOnly>
  );
};

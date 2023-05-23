import { Show, Suspense, createSignal, lazy, type Component } from "solid-js";
import { ClientOnly } from "~/components/ClientOnly";
import { TransformContextProvider } from "../TransformContext";

const PixiStage = lazy(() => import("../PixiStage/PixiStage"));

const ClientBoard: Component = () => {
  const [canvas, setCanvas] = createSignal<HTMLCanvasElement>();

  return (
    <TransformContextProvider>
      <canvas ref={setCanvas} class="h-full w-full" />
      <Show when={canvas()}>
        {(canvas) => (
          <Suspense>
            <PixiStage canvas={canvas()} />
          </Suspense>
        )}
      </Show>
    </TransformContextProvider>
  );
};
export const Board: Component = () => {
  return (
    <ClientOnly>
      <ClientBoard />
    </ClientOnly>
  );
};

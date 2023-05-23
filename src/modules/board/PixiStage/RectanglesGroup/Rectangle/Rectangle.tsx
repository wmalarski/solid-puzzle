import * as PIXI from "pixi.js";
import { onCleanup, onMount, type Component } from "solid-js";
import { usePixiApp } from "../../PixiApp";

export const Rectangle: Component = () => {
  const app = usePixiApp();
  // const workspace = useWorkspaceContext();
  // const { selectedId, setSelectedId } = useSelectedId();

  const container = new PIXI.Container();

  // createLabel({ container, sample: props.sample });
  // createSprite({ container, sample: props.sample, tool: props.tool });

  onMount(() => {
    app().stage.addChild(container);
  });
  onCleanup(() => {
    app().stage.removeChild(container);
  });

  // createEffect(() => {
  //   if (props.tool !== "selector") {
  //     return;
  //   }

  //   useDragObject({
  //     displayObject: container,
  //     onDragEnd: () => {
  //       workspace.onChange(
  //         "samples",
  //         (sample) => sample.id === props.sample.id,
  //         "shape",
  //         "x",
  //         container.x
  //       );
  //       workspace.onChange(
  //         "samples",
  //         (sample) => sample.id === props.sample.id,
  //         "shape",
  //         "y",
  //         container.y
  //       );
  //     },
  //     onDragStart: () => {
  //       if (selectedId() !== props.sample.id) {
  //         setSelectedId(props.sample.id);
  //       }
  //     },
  //   });
  // });

  // createEffect(() => {
  //   container.x = props.sample.shape.x;
  // });
  // createEffect(() => {
  //   container.y = props.sample.shape.y;
  // });

  return null;

  // return (
  //   <Show when={props.tool === "selector" && selectedId() === props.sample.id}>
  //     <Transformer
  //       sample={props.sample}
  //       tool={props.tool}
  //       container={container}
  //     />
  //   </Show>
  // );
};

import * as PIXI from "pixi.js";
import { createEffect, onCleanup, onMount } from "solid-js";

type Props = {
  container: PIXI.Container;
};

export const createLabel = (props: Props) => {
  const text = new PIXI.Text("", {
    fontSize: 14,
  });

  onMount(() => {
    props.container.addChild(text);
  });

  onCleanup(() => {
    props.container.removeChild(text);
  });

  createEffect(() => {
    text.text = "props.sample.id";
  });

  return text;
};

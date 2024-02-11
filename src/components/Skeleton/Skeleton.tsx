import type { Component, ComponentProps } from "solid-js";

import { splitProps } from "solid-js";

import { twCx } from "../utils/twCva";

export const Skeleton: Component<ComponentProps<"div">> = (props) => {
  const [, rest] = splitProps(props, ["class"]);

  return (
    <div
      class={twCx("bg-primary/10 animate-pulse rounded-md", props.class)}
      {...rest}
    />
  );
};

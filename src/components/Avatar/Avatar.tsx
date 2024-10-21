import type { VariantProps } from "class-variance-authority";

import { Component, type ComponentProps, splitProps } from "solid-js";

import { twCx } from "../utils/twCva";
import { avatarClass, avatarContentClass } from "./Avatar.recipe";

export type AvatarGroupProps = ComponentProps<"div">;

export const AvatarGroup: Component<AvatarGroupProps> = (props) => {
  return (
    <div {...props} class={twCx("avatar-group -space-x-6", props.class)} />
  );
};

export type AvatarProps = ComponentProps<"div"> &
  VariantProps<typeof avatarClass>;

export const Avatar: Component<AvatarProps> = (props) => {
  const [split, rest] = splitProps(props, ["placeholder", "presence"]);

  return (
    <div {...rest} class={avatarClass({ class: props.class, ...split })} />
  );
};

export type AvatarContentProps = ComponentProps<"div"> &
  VariantProps<typeof avatarContentClass>;

export const AvatarContent: Component<AvatarContentProps> = (props) => {
  const [split, rest] = splitProps(props, [
    "size",
    "variant",
    "placeholder",
    "ring"
  ]);

  return (
    <div
      {...rest}
      class={avatarContentClass({ class: props.class, ...split })}
    />
  );
};

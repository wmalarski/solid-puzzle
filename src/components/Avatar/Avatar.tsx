import type { VariantProps } from "class-variance-authority";

import { type ComponentProps, splitProps } from "solid-js";

import { twCx } from "../utils/twCva";
import { avatarClass, avatarContentClass } from "./Avatar.recipe";

export type AvatarGroupProps = ComponentProps<"div">;

export function AvatarGroup(props: AvatarGroupProps) {
  return (
    <div {...props} class={twCx("avatar-group -space-x-6", props.class)} />
  );
}

export type AvatarProps = ComponentProps<"div"> &
  VariantProps<typeof avatarClass>;

export function Avatar(props: AvatarProps) {
  const [split, rest] = splitProps(props, ["placeholder", "presence"]);

  return (
    <div {...rest} class={avatarClass({ class: props.class, ...split })} />
  );
}

export type AvatarContentProps = ComponentProps<"div"> &
  VariantProps<typeof avatarContentClass>;

export function AvatarContent(props: AvatarContentProps) {
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
}

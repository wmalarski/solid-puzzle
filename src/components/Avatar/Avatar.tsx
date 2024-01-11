import type { VariantProps } from "class-variance-authority";

import { type Component, type ComponentProps, splitProps } from "solid-js";

import { twCva, twCx } from "../utils/twCva";

export type AvatarGroupProps = ComponentProps<"div">;

export const AvatarGroup: Component<AvatarGroupProps> = (props) => {
  return (
    <div {...props} class={twCx("avatar-group -space-x-6", props.class)} />
  );
};

export const avatarClass = twCva("avatar", {
  defaultVariants: {
    placeholder: null,
    presence: null,
  },
  variants: {
    placeholder: {
      true: "placeholder",
    },
    presence: {
      offline: "offline",
      online: "online",
    },
  },
});

export type AvatarProps = ComponentProps<"div"> &
  VariantProps<typeof avatarClass>;

export const Avatar: Component<AvatarProps> = (props) => {
  const [split, rest] = splitProps(props, ["placeholder", "presence"]);

  return (
    <div {...rest} class={avatarClass({ class: props.class, ...split })} />
  );
};

export const avatarContentClass = twCva("", {
  defaultVariants: {
    placeholder: null,
    ring: null,
    size: "md",
    variant: "full",
  },
  variants: {
    placeholder: {
      true: "bg-neutral-focus text-neutral-content",
    },
    ring: {
      accent: "ring ring-accent ring-offset-base-100 ring-offset-2",
      error: "ring ring-error ring-offset-base-100 ring-offset-2",
      primary: "ring ring-primary ring-offset-base-100 ring-offset-2",
      secondary: "ring ring-secondary ring-offset-base-100 ring-offset-2",
      success: "ring ring-success ring-offset-base-100 ring-offset-2",
      warning: "ring ring-warning ring-offset-base-100 ring-offset-2",
    },
    size: {
      lg: "w-32",
      md: "w-20",
      sm: "w-16",
      xs: "w-8",
    },
    variant: {
      full: "rounded-full",
      rounded: "rounded",
      xl: "rounded-xl",
    },
  },
});

export type AvatarContentProps = ComponentProps<"div"> &
  VariantProps<typeof avatarContentClass>;

export const AvatarContent: Component<AvatarContentProps> = (props) => {
  const [split, rest] = splitProps(props, [
    "size",
    "variant",
    "placeholder",
    "ring",
  ]);

  return (
    <div
      {...rest}
      class={avatarContentClass({ class: props.class, ...split })}
    />
  );
};

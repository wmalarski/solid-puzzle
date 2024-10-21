import type { VariantProps } from "class-variance-authority";

import { Component, type ComponentProps, splitProps } from "solid-js";

import { twCva, twCx } from "../utils/twCva";

export type TextFieldRootProps = ComponentProps<"fieldset">;

export const TextFieldRoot: Component<TextFieldRootProps> = (props) => {
  return <fieldset {...props} class={twCx("form-control", props.class)} />;
};

export type TextFieldLabelProps = ComponentProps<"label">;

export const TextFieldLabel: Component<TextFieldLabelProps> = (props) => {
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label {...props} class={twCx("label gap-2", props.class)} />
  );
};

export type TextFieldLabelTextProps = ComponentProps<"span">;

export const TextFieldLabelText: Component<TextFieldLabelTextProps> = (
  props
) => {
  return <span {...props} class={twCx("label-text", props.class)} />;
};

export type TextFieldDescriptionProps = ComponentProps<"span">;

export const TextFieldDescription: Component<TextFieldDescriptionProps> = (
  props
) => {
  return <span {...props} class={twCx("label-text-alt pt-2", props.class)} />;
};

export type TextFieldErrorMessageProps = ComponentProps<"span">;

export const TextFieldErrorMessage: Component<TextFieldErrorMessageProps> = (
  props
) => {
  return (
    <span {...props} class={twCx("text-sm text-error pt-2", props.class)} />
  );
};

export const textFieldInputRecipe = twCva("input", {
  defaultVariants: {
    color: null,
    size: "md",
    variant: null,
    width: null
  },
  variants: {
    color: {
      accent: "input-accent",
      error: "input-error",
      info: "input-info",
      primary: "input-primary",
      secondary: "input-secondary",
      success: "input-success",
      warning: "input-warning"
    },
    size: {
      lg: "input-lg",
      md: "input-md",
      sm: "input-sm",
      xs: "input-xs"
    },
    variant: {
      bordered: "input-bordered",
      ghost: "input-ghost"
    },
    width: {
      full: "w-full"
    }
  }
});

const variantPropsList = ["color", "size", "variant", "width"] as const;

export type TextFieldInputProps = ComponentProps<"input"> &
  VariantProps<typeof textFieldInputRecipe>;

export const TextFieldInput: Component<TextFieldInputProps> = (props) => {
  const [split, rest] = splitProps(props, variantPropsList);

  return (
    <input
      {...rest}
      class={textFieldInputRecipe({ class: props.class, ...split })}
    />
  );
};

export type TextFieldTextAreaProps = ComponentProps<"textarea"> &
  VariantProps<typeof textFieldInputRecipe>;

export const TextFieldTextArea: Component<TextFieldTextAreaProps> = (props) => {
  const [split, rest] = splitProps(props, variantPropsList);

  return (
    <textarea
      {...rest}
      class={textFieldInputRecipe({ class: props.class, ...split })}
    />
  );
};

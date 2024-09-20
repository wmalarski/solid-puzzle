import type { VariantProps } from "class-variance-authority";

import { type ComponentProps, splitProps } from "solid-js";

import { twCva, twCx } from "../utils/twCva";

export type TextFieldRootProps = ComponentProps<"fieldset">;

export function TextFieldRoot(props: TextFieldRootProps) {
  return <fieldset {...props} class={twCx("form-control", props.class)} />;
}

export type TextFieldLabelProps = ComponentProps<"label">;

export function TextFieldLabel(props: TextFieldLabelProps) {
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label {...props} class={twCx("label gap-2", props.class)} />
  );
}

export type TextFieldLabelTextProps = ComponentProps<"span">;

export function TextFieldLabelText(props: TextFieldLabelTextProps) {
  return (
     
    <span {...props} class={twCx("label-text", props.class)} />
  );
}

export type TextFieldDescriptionProps = ComponentProps<"span">;

export function TextFieldDescription(props: TextFieldDescriptionProps) {
  return <span {...props} class={twCx("label-text-alt pt-2", props.class)} />;
}

export type TextFieldErrorMessageProps = ComponentProps<"span">;

export function TextFieldErrorMessage(props: TextFieldErrorMessageProps) {
  return (
    <span {...props} class={twCx("text-sm text-error pt-2", props.class)} />
  );
}

export const textFieldInputClass = twCva("input", {
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
  VariantProps<typeof textFieldInputClass>;

export function TextFieldInput(props: TextFieldInputProps) {
  const [split, rest] = splitProps(props, variantPropsList);

  return (
    <input
      {...rest}
      class={textFieldInputClass({ class: props.class, ...split })}
    />
  );
}

export type TextFieldTextAreaProps = ComponentProps<"textarea"> &
  VariantProps<typeof textFieldInputClass>;

export function TextFieldTextArea(props: TextFieldTextAreaProps) {
  const [split, rest] = splitProps(props, variantPropsList);

  return (
    <textarea
      {...rest}
      class={textFieldInputClass({ class: props.class, ...split })}
    />
  );
}

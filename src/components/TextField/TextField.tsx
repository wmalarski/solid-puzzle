import type { VariantProps } from "class-variance-authority";
import { splitProps, type Component, type JSX } from "solid-js";
import { twCva, twCx } from "../utils/twCva";

export type TextFieldRootProps = JSX.IntrinsicElements["fieldset"];

export const TextFieldRoot: Component<TextFieldRootProps> = (props) => {
  return <fieldset {...props} class={twCx("form-control", props.class)} />;
};

export type TextFieldLabelProps = JSX.IntrinsicElements["label"];

export const TextFieldLabel: Component<TextFieldLabelProps> = (props) => {
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label {...props} class={twCx("label gap-2", props.class)} />
  );
};

export type TextFieldLabelTextProps = JSX.IntrinsicElements["span"];

export const TextFieldLabelText: Component<TextFieldLabelTextProps> = (
  props,
) => {
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <span {...props} class={twCx("label-text", props.class)} />
  );
};

export type TextFieldDescriptionProps = JSX.IntrinsicElements["span"];

export const TextFieldDescription: Component<TextFieldDescriptionProps> = (
  props,
) => {
  return <span {...props} class={twCx("label-text-alt pt-2", props.class)} />;
};

export type TextFieldErrorMessageProps = JSX.IntrinsicElements["span"];

export const TextFieldErrorMessage: Component<TextFieldErrorMessageProps> = (
  props,
) => {
  return (
    <span {...props} class={twCx("text-sm text-error-content", props.class)} />
  );
};

export const textFieldInputClass = twCva("input", {
  defaultVariants: {
    color: null,
    size: "md",
    variant: null,
  },
  variants: {
    color: {
      accent: "input-accent",
      error: "input-error",
      info: "input-info",
      primary: "input-primary",
      secondary: "input-secondary",
      success: "input-success",
      warning: "input-warning",
    },
    size: {
      lg: "input-lg",
      md: "input-md",
      sm: "input-sm",
      xs: "input-xs",
    },
    variant: {
      bordered: "input-bordered",
      ghost: "input-ghost",
    },
  },
});

export type TextFieldInputProps = JSX.IntrinsicElements["input"] &
  VariantProps<typeof textFieldInputClass>;

export const TextFieldInput: Component<TextFieldInputProps> = (props) => {
  const [split, rest] = splitProps(props, ["color", "size", "variant"]);

  return (
    <input
      {...rest}
      class={textFieldInputClass({ class: props.class, ...split })}
    />
  );
};

export type TextFieldTextAreaProps = JSX.IntrinsicElements["textarea"] &
  VariantProps<typeof textFieldInputClass>;

export const TextFieldTextArea: Component<TextFieldTextAreaProps> = (props) => {
  const [split, rest] = splitProps(props, ["color", "size", "variant"]);

  return (
    <textarea
      {...rest}
      class={textFieldInputClass({ class: props.class, ...split })}
    />
  );
};

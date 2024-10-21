import type { VariantProps } from "class-variance-authority";

import { DropdownMenu as KobalteDropdownMenu } from "@kobalte/core";
import {
  Component,
  ComponentProps,
  createSignal,
  onMount,
  splitProps
} from "solid-js";

import { buttonSplitProps } from "../Button/Button";
import { buttonRecipe } from "../Button/Button.recipe";
import { twCx } from "../utils/twCva";
import styles from "./DropdownMenu.module.css";
import {
  dropdownMenuContentRecipe,
  dropdownMenuIconRecipe,
  dropdownMenuItemRecipe,
  dropdownMenuSubTriggerRecipe
} from "./DropdownMenu.recipe";

export const DropdownMenuRoot = KobalteDropdownMenu.Root;

export type DropdownMenuTriggerProps = ComponentProps<
  typeof KobalteDropdownMenu.Trigger
> &
  VariantProps<typeof buttonRecipe>;

export const DropdownMenuTrigger: Component<DropdownMenuTriggerProps> = (
  props
) => {
  const [split, rest] = splitProps(props, buttonSplitProps);

  return <KobalteDropdownMenu.Trigger {...rest} class={buttonRecipe(split)} />;
};

export type DropdownMenuIconProps = ComponentProps<
  typeof KobalteDropdownMenu.Icon
> &
  VariantProps<typeof dropdownMenuIconRecipe>;

export const DropdownMenuIcon: Component<DropdownMenuIconProps> = (props) => {
  const [split, rest] = splitProps(props, ["rotation"]);

  return (
    <KobalteDropdownMenu.Icon
      {...rest}
      class={dropdownMenuIconRecipe({ class: props.class, ...split })}
    />
  );
};

export const DropdownMenuPortal = KobalteDropdownMenu.Portal;

export const DropdownMenuContent: Component<
  ComponentProps<typeof KobalteDropdownMenu.Content>
> = (props) => {
  const [ref, setRef] = createSignal<HTMLDivElement>();

  onMount(() => {
    ref()?.parentElement?.classList.add(styles.portal);
  });

  return (
    <KobalteDropdownMenu.Content
      {...props}
      class={dropdownMenuContentRecipe({ class: props.class })}
      ref={setRef}
    />
  );
};

export const DropdownMenuArrow: Component<
  ComponentProps<typeof KobalteDropdownMenu.Arrow>
> = (props) => {
  return <KobalteDropdownMenu.Arrow {...props} class={twCx("", props.class)} />;
};

export const DropdownMenuSeparator: Component<
  ComponentProps<typeof KobalteDropdownMenu.Separator>
> = (props) => {
  return (
    <KobalteDropdownMenu.Separator
      {...props}
      class={twCx("h-px m-1.5 border-[1px] border-base-content", props.class)}
    />
  );
};

export const DropdownMenuGroup: Component<
  ComponentProps<typeof KobalteDropdownMenu.Group>
> = (props) => {
  return <KobalteDropdownMenu.Group {...props} class={twCx("", props.class)} />;
};

export const DropdownMenuGroupLabel: Component<
  ComponentProps<typeof KobalteDropdownMenu.GroupLabel>
> = (props) => {
  return (
    <KobalteDropdownMenu.GroupLabel
      {...props}
      class={twCx("px-6 text-sm leading-[32px] text-base-200", props.class)}
    />
  );
};

export const DropdownMenuSub = KobalteDropdownMenu.Sub;

export const DropdownMenuSubTrigger: Component<
  ComponentProps<typeof KobalteDropdownMenu.SubTrigger>
> = (props) => {
  return (
    <KobalteDropdownMenu.SubTrigger
      {...props}
      class={dropdownMenuSubTriggerRecipe({ class: props.class })}
    />
  );
};

export const DropdownMenuSubContent: Component<
  ComponentProps<typeof KobalteDropdownMenu.SubContent>
> = (props) => {
  return (
    <KobalteDropdownMenu.SubContent
      {...props}
      class={dropdownMenuContentRecipe({ class: props.class })}
    />
  );
};

export const DropdownMenuItem: Component<
  ComponentProps<typeof KobalteDropdownMenu.Item>
> = (props) => {
  return (
    <KobalteDropdownMenu.Item
      {...props}
      class={dropdownMenuItemRecipe({ class: props.class })}
    />
  );
};

export const DropdownMenuItemLabel: Component<
  ComponentProps<typeof KobalteDropdownMenu.ItemLabel>
> = (props) => {
  return (
    <KobalteDropdownMenu.ItemLabel
      {...props}
      class={twCx(
        "text-sm overflow-ellipsis flex gap-2 items-center",
        props.class
      )}
    />
  );
};

export const DropdownMenuItemDescription: Component<
  ComponentProps<typeof KobalteDropdownMenu.ItemDescription>
> = (props) => {
  return (
    <KobalteDropdownMenu.ItemDescription
      {...props}
      class={twCx("text-xs font-semibold uppercase", props.class)}
    />
  );
};

export const DropdownMenuItemIndicator: Component<
  ComponentProps<typeof KobalteDropdownMenu.ItemIndicator>
> = (props) => {
  return (
    <KobalteDropdownMenu.ItemIndicator
      {...props}
      class={twCx(
        "absolute left-0 h-4 w-4 inline-flex items-center justify-center",
        props.class
      )}
    />
  );
};

export const DropdownMenuRadioGroup = KobalteDropdownMenu.RadioGroup;

export const DropdownMenuRadioItem: Component<
  ComponentProps<typeof KobalteDropdownMenu.RadioItem>
> = (props) => {
  return (
    <KobalteDropdownMenu.RadioItem
      {...props}
      class={dropdownMenuItemRecipe({ class: props.class })}
    />
  );
};

export const DropdownMenuCheckboxItem: Component<
  ComponentProps<typeof KobalteDropdownMenu.CheckboxItem>
> = (props) => {
  return (
    <KobalteDropdownMenu.CheckboxItem
      {...props}
      class={dropdownMenuItemRecipe({ class: props.class })}
    />
  );
};

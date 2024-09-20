import type { VariantProps } from "class-variance-authority";

import { DropdownMenu as KobalteDropdownMenu } from "@kobalte/core";
import { ComponentProps, createSignal, onMount, splitProps } from "solid-js";

import { buttonClass, buttonSplitProps } from "../Button";
import { twCx } from "../utils/twCva";
import styles from "./DropdownMenu.module.css";
import {
  dropdownMenuContentClass,
  dropdownMenuIconClass,
  dropdownMenuItemClass,
  dropdownMenuSubTriggerClass
} from "./DropdownMenu.recipe";

export const DropdownMenuRoot = KobalteDropdownMenu.Root;

export type DropdownMenuTriggerProps = ComponentProps<
  typeof KobalteDropdownMenu.Trigger
> &
  VariantProps<typeof buttonClass>;

export function DropdownMenuTrigger(props: DropdownMenuTriggerProps) {
  const [split, rest] = splitProps(props, buttonSplitProps);

  return <KobalteDropdownMenu.Trigger {...rest} class={buttonClass(split)} />;
}

export type DropdownMenuIconProps = ComponentProps<
  typeof KobalteDropdownMenu.Icon
> &
  VariantProps<typeof dropdownMenuIconClass>;

export function DropdownMenuIcon(props: DropdownMenuIconProps) {
  const [split, rest] = splitProps(props, ["rotation"]);

  return (
    <KobalteDropdownMenu.Icon
      {...rest}
      class={dropdownMenuIconClass({ class: props.class, ...split })}
    />
  );
}

export const DropdownMenuPortal = KobalteDropdownMenu.Portal;

export function DropdownMenuContent(
  props: ComponentProps<typeof KobalteDropdownMenu.Content>
) {
  const [ref, setRef] = createSignal<HTMLDivElement>();

  onMount(() => {
    ref()?.parentElement?.classList.add(styles.portal);
  });

  return (
    <KobalteDropdownMenu.Content
      {...props}
      class={dropdownMenuContentClass({ class: props.class })}
      ref={setRef}
    />
  );
}

export function DropdownMenuArrow(
  props: ComponentProps<typeof KobalteDropdownMenu.Arrow>
) {
  return <KobalteDropdownMenu.Arrow {...props} class={twCx("", props.class)} />;
}

export function DropdownMenuSeparator(
  props: ComponentProps<typeof KobalteDropdownMenu.Separator>
) {
  return (
    <KobalteDropdownMenu.Separator
      {...props}
      class={twCx("h-px m-1.5 border-[1px] border-base-content", props.class)}
    />
  );
}

export function DropdownMenuGroup(
  props: ComponentProps<typeof KobalteDropdownMenu.Group>
) {
  return <KobalteDropdownMenu.Group {...props} class={twCx("", props.class)} />;
}

export function DropdownMenuGroupLabel(
  props: ComponentProps<typeof KobalteDropdownMenu.GroupLabel>
) {
  return (
    <KobalteDropdownMenu.GroupLabel
      {...props}
      class={twCx("px-6 text-sm leading-[32px] text-base-200", props.class)}
    />
  );
}

export const DropdownMenuSub = KobalteDropdownMenu.Sub;

export function DropdownMenuSubTrigger(
  props: ComponentProps<typeof KobalteDropdownMenu.SubTrigger>
) {
  return (
    <KobalteDropdownMenu.SubTrigger
      {...props}
      class={dropdownMenuSubTriggerClass({ class: props.class })}
    />
  );
}

export function DropdownMenuSubContent(
  props: ComponentProps<typeof KobalteDropdownMenu.SubContent>
) {
  return (
    <KobalteDropdownMenu.SubContent
      {...props}
      class={dropdownMenuContentClass({ class: props.class })}
    />
  );
}

export function DropdownMenuItem(
  props: ComponentProps<typeof KobalteDropdownMenu.Item>
) {
  return (
    <KobalteDropdownMenu.Item
      {...props}
      class={dropdownMenuItemClass({ class: props.class })}
    />
  );
}

export function DropdownMenuItemLabel(
  props: ComponentProps<typeof KobalteDropdownMenu.ItemLabel>
) {
  return (
    <KobalteDropdownMenu.ItemLabel
      {...props}
      class={twCx(
        "text-sm overflow-ellipsis flex gap-2 items-center",
        props.class
      )}
    />
  );
}

export function DropdownMenuItemDescription(
  props: ComponentProps<typeof KobalteDropdownMenu.ItemDescription>
) {
  return (
    <KobalteDropdownMenu.ItemDescription
      {...props}
      class={twCx("text-xs font-semibold uppercase", props.class)}
    />
  );
}

export function DropdownMenuItemIndicator(
  props: ComponentProps<typeof KobalteDropdownMenu.ItemIndicator>
) {
  return (
    <KobalteDropdownMenu.ItemIndicator
      {...props}
      class={twCx(
        "absolute left-0 h-4 w-4 inline-flex items-center justify-center",
        props.class
      )}
    />
  );
}

export const DropdownMenuRadioGroup = KobalteDropdownMenu.RadioGroup;

export function DropdownMenuRadioItem(
  props: ComponentProps<typeof KobalteDropdownMenu.RadioItem>
) {
  return (
    <KobalteDropdownMenu.RadioItem
      {...props}
      class={dropdownMenuItemClass({ class: props.class })}
    />
  );
}

export function DropdownMenuCheckboxItem(
  props: ComponentProps<typeof KobalteDropdownMenu.CheckboxItem>
) {
  return (
    <KobalteDropdownMenu.CheckboxItem
      {...props}
      class={dropdownMenuItemClass({ class: props.class })}
    />
  );
}

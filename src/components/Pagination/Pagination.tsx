import type { VariantProps } from "class-variance-authority";

import { Component, type ComponentProps, splitProps } from "solid-js";

import { useI18n } from "~/contexts/I18nContext";

import { buttonRecipe } from "../Button/Button.recipe";
import { ArrowLeftIcon } from "../Icons/ArrowLeftIcon";
import { ArrowRightIcon } from "../Icons/ArrowRightIcon";
import { DotsHorizontalIcon } from "../Icons/DotsHorizontalIcon";
import { twCx } from "../utils/twCva";

export const PaginationRoot: Component<ComponentProps<"nav">> = (props) => {
  const [, rest] = splitProps(props, ["class"]);

  return (
    <nav
      aria-label="pagination"
      class={twCx("mx-auto flex w-full justify-center", props.class)}
      role="navigation"
      {...rest}
    />
  );
};

export const PaginationContent: Component<ComponentProps<"ul">> = (props) => {
  const [, rest] = splitProps(props, ["class"]);

  return (
    <ul
      class={twCx("flex flex-row items-center gap-1", props.class)}
      {...rest}
    />
  );
};

export const PaginationItem: Component<ComponentProps<"li">> = (props) => {
  const [, rest] = splitProps(props, ["class"]);

  return <li class={twCx("", props.class)} {...rest} />;
};

type PaginationLinkProps = {
  isActive?: boolean;
} & ComponentProps<"a"> &
  Omit<VariantProps<typeof buttonRecipe>, "shape" | "variant">;

export const PaginationLink: Component<PaginationLinkProps> = (props) => {
  const [, rest] = splitProps(props, ["class", "isActive", "size", "color"]);

  return (
    <PaginationItem>
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
      <a
        aria-current={props.isActive ? "page" : undefined}
        class={twCx(
          buttonRecipe({
            shape: "square",
            size: props.size,
            variant: props.isActive ? "outline" : "ghost"
          }),
          props.class
        )}
        {...rest}
      />
    </PaginationItem>
  );
};

export const PaginationPrevious: Component<PaginationLinkProps> = (props) => {
  const [, rest] = splitProps(props, ["class"]);

  const { t } = useI18n();

  return (
    <PaginationLink
      aria-label={t("pagination.previousLabel")}
      class={twCx("gap-1 pl-2.5", props.class)}
      {...rest}
    >
      <ArrowLeftIcon class="size-4" />
      <span>{t("pagination.previous")}</span>
    </PaginationLink>
  );
};

export const PaginationNext: Component<PaginationLinkProps> = (props) => {
  const [, rest] = splitProps(props, ["class"]);

  const { t } = useI18n();

  return (
    <PaginationLink
      aria-label={t("pagination.nextLabel")}
      class={twCx("gap-1 pr-2.5", props.class)}
      {...rest}
    >
      <span>{t("pagination.next")}</span>
      <ArrowRightIcon class="size-4" />
    </PaginationLink>
  );
};

export const PaginationEllipsis: Component<ComponentProps<"span">> = (
  props
) => {
  const [, rest] = splitProps(props, ["class"]);

  const { t } = useI18n();

  return (
    <span
      aria-hidden
      class={twCx("flex h-9 w-9 items-center justify-center", props.class)}
      {...rest}
    >
      <DotsHorizontalIcon class="size-4" />
      <span class="sr-only">{t("pagination.more")}</span>
    </span>
  );
};

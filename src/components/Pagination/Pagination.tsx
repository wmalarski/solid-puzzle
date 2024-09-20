import type { VariantProps } from "class-variance-authority";

import { type ComponentProps, splitProps } from "solid-js";

import { useI18n } from "~/contexts/I18nContext";

import { buttonClass } from "../Button";
import { ArrowLeftIcon } from "../Icons/ArrowLeftIcon";
import { ArrowRightIcon } from "../Icons/ArrowRightIcon";
import { DotsHorizontalIcon } from "../Icons/DotsHorizontalIcon";
import { twCx } from "../utils/twCva";

export function PaginationRoot(props: ComponentProps<"nav">) {
  const [, rest] = splitProps(props, ["class"]);

  return (
    <nav
      aria-label="pagination"
      class={twCx("mx-auto flex w-full justify-center", props.class)}
      role="navigation"
      {...rest}
    />
  );
}

export function PaginationContent(props: ComponentProps<"ul">) {
  const [, rest] = splitProps(props, ["class"]);

  return (
    <ul
      class={twCx("flex flex-row items-center gap-1", props.class)}
      {...rest}
    />
  );
}

export function PaginationItem(props: ComponentProps<"li">) {
  const [, rest] = splitProps(props, ["class"]);

  return <li class={twCx("", props.class)} {...rest} />;
}

type PaginationLinkProps = {
    isActive?: boolean;
  } &
  ComponentProps<"a"> & Omit<VariantProps<typeof buttonClass>, "shape" | "variant">;

export function PaginationLink(props: PaginationLinkProps) {
  const [, rest] = splitProps(props, ["class", "isActive", "size", "color"]);

  return (
    <PaginationItem>
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
      <a
        aria-current={props.isActive ? "page" : undefined}
        class={twCx(
          buttonClass({
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
}

export function PaginationPrevious(props: PaginationLinkProps) {
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
}

export function PaginationNext(props: PaginationLinkProps) {
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
}

export function PaginationEllipsis(props: ComponentProps<"span">) {
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
}

import type { VariantProps } from "class-variance-authority";
import { splitProps, type Component, type ComponentProps } from "solid-js";
import { buttonClass } from "../Button";
import { ArrowLeftIcon } from "../Icons/ArrowLeftIcon";
import { ArrowRightIcon } from "../Icons/ArrowRightIcon";
import { DotsHorizontalIcon } from "../Icons/DotsHorizontalIcon";
import { twCx } from "../utils/twCva";

export const Pagination: Component<ComponentProps<"nav">> = (props) => {
  const [, rest] = splitProps(props, ["class"]);

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      class={twCx("mx-auto flex w-full justify-center", props.class)}
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

type PaginationLinkProps = ComponentProps<"a"> &
  Omit<VariantProps<typeof buttonClass>, "shape" | "variant"> & {
    isActive?: boolean;
  };

export const PaginationLink: Component<PaginationLinkProps> = (props) => {
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
            variant: props.isActive ? "outline" : "ghost",
          }),
          props.class,
        )}
        {...rest}
      />
    </PaginationItem>
  );
};

export const PaginationPrevious: typeof PaginationLink = (props) => {
  const [, rest] = splitProps(props, ["class"]);
  return (
    <PaginationLink
      aria-label="Go to previous page"
      class={twCx("gap-1 pl-2.5", props.class)}
      {...rest}
    >
      <ArrowLeftIcon class="h-4 w-4" />
      <span>Previous</span>
    </PaginationLink>
  );
};

export const PaginationNext: typeof PaginationLink = (props) => {
  const [, rest] = splitProps(props, ["class"]);
  return (
    <PaginationLink
      aria-label="Go to next page"
      class={twCx("gap-1 pr-2.5", props.class)}
      {...rest}
    >
      <span>Next</span>
      <ArrowRightIcon class="h-4 w-4" />
    </PaginationLink>
  );
};

export const PaginationEllipsis: Component<ComponentProps<"span">> = (
  props,
) => {
  const [, rest] = splitProps(props, ["class"]);
  return (
    <span
      aria-hidden
      class={twCx("flex h-9 w-9 items-center justify-center", props.class)}
      {...rest}
    >
      <DotsHorizontalIcon class="h-4 w-4" />
      <span class="sr-only">More pages</span>
    </span>
  );
};
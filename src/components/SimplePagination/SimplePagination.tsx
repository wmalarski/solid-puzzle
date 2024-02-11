import type { VariantProps } from "class-variance-authority";

import {
  type Component,
  type ComponentProps,
  createContext,
  createMemo,
  splitProps,
  useContext
} from "solid-js";

import { useI18n } from "~/contexts/I18nContext";

import { buttonClass } from "../Button";
import { ArrowLeftIcon } from "../Icons/ArrowLeftIcon";
import { ArrowRightIcon } from "../Icons/ArrowRightIcon";
import { twCx } from "../utils/twCva";

type SimplePaginationContextValues = {
  count: number;
  page: number;
};

const SimplePaginationContext = createContext<
  () => SimplePaginationContextValues
>(() => ({ count: 0, page: 0 }));

export type SimplePaginationRootProps = ComponentProps<"nav"> &
  SimplePaginationContextValues;

export const SimplePaginationRoot: Component<SimplePaginationRootProps> = (
  props
) => {
  const { t } = useI18n();

  const [, rest] = splitProps(props, ["class", "count", "page"]);

  const value = createMemo(() => {
    return { count: props.count, page: props.page };
  });

  return (
    <SimplePaginationContext.Provider value={value}>
      <nav
        aria-label={t("pagination.label")}
        class={twCx(
          "mx-auto flex w-full justify-center flex-row items-center gap-1",
          props.class
        )}
        role="navigation"
        {...rest}
      />
    </SimplePaginationContext.Provider>
  );
};

type PaginationLinkProps = ComponentProps<"a"> &
  Omit<VariantProps<typeof buttonClass>, "shape">;

const PaginationLink: Component<PaginationLinkProps> = (props) => {
  const [split, rest] = splitProps(props, [
    "class",
    "size",
    "color",
    "isLoading",
    "variant"
  ]);

  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      class={buttonClass({ shape: "square", ...split, class: props.class })}
      {...rest}
    />
  );
};

export const SimplePaginationPrevious: Component<PaginationLinkProps> = (
  props
) => {
  const { t } = useI18n();

  const [, rest] = splitProps(props, ["class", "href"]);

  const context = useContext(SimplePaginationContext);

  const hasPrevious = createMemo(() => {
    return context().page > 0;
  });

  return (
    <PaginationLink
      aria-disabled={hasPrevious()}
      aria-label={t("pagination.previousLabel")}
      href={hasPrevious() ? props.href : "#"}
      role={hasPrevious() ? undefined : "button"}
      {...rest}
    >
      <ArrowLeftIcon class="size-4" />
      <span>{t("pagination.previous")}</span>
    </PaginationLink>
  );
};

export const SimplePaginationNext: Component<PaginationLinkProps> = (props) => {
  const { t } = useI18n();

  const [, rest] = splitProps(props, ["class", "href"]);

  const context = useContext(SimplePaginationContext);

  const hasNext = createMemo(() => {
    const value = context();
    return value.page < value.count - 1;
  });

  return (
    <PaginationLink
      aria-disabled={hasNext()}
      aria-label={t("pagination.nextLabel")}
      href={hasNext() ? props.href : "#"}
      role={hasNext() ? undefined : "button"}
      {...rest}
    >
      <span>{t("pagination.next")}</span>
      <ArrowRightIcon class="size-4" />
    </PaginationLink>
  );
};

type SimplePaginationValueProps = ComponentProps<"span">;

export const SimplePaginationValue: Component<SimplePaginationValueProps> = (
  props
) => {
  const [, rest] = splitProps(props, ["class"]);

  return <span class={twCx("", props.class)} {...rest} />;
};

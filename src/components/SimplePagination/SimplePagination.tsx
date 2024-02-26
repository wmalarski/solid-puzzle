import type { VariantProps } from "class-variance-authority";

import {
  type ComponentProps,
  createContext,
  createMemo,
  splitProps,
  useContext
} from "solid-js";

import { useI18n } from "~/contexts/I18nContext";

import { buttonClass, buttonSplitProps } from "../Button";
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

export function SimplePaginationRoot(props: SimplePaginationRootProps) {
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
}

type PaginationLinkProps = ComponentProps<"a"> &
  VariantProps<typeof buttonClass>;

export function SimplePaginationPrevious(props: PaginationLinkProps) {
  const { t } = useI18n();

  const [split, rest] = splitProps(props, buttonSplitProps);

  const context = useContext(SimplePaginationContext);

  const hasPrevious = createMemo(() => {
    return context().page > 0;
  });

  return (
    <a
      aria-disabled={hasPrevious()}
      aria-label={t("pagination.previousLabel")}
      class={buttonClass({
        ...split,
        class: props.class,
        variant: hasPrevious() ? split.variant : "disabled"
      })}
      role={hasPrevious() ? undefined : "button"}
      {...rest}
      href={hasPrevious() ? props.href : "#"}
    >
      <ArrowLeftIcon class="size-4" />
      <span>{t("pagination.previous")}</span>
    </a>
  );
}

export function SimplePaginationNext(props: PaginationLinkProps) {
  const { t } = useI18n();

  const [split, rest] = splitProps(props, buttonSplitProps);

  const context = useContext(SimplePaginationContext);

  const hasNext = createMemo(() => {
    const value = context();
    return value.page < value.count - 1;
  });

  return (
    <a
      aria-disabled={hasNext()}
      aria-label={t("pagination.nextLabel")}
      class={buttonClass({
        ...split,
        class: props.class,
        variant: hasNext() ? split.variant : "disabled"
      })}
      role={hasNext() ? undefined : "button"}
      {...rest}
      href={hasNext() ? props.href : "#"}
    >
      <span>{t("pagination.next")}</span>
      <ArrowRightIcon class="size-4" />
    </a>
  );
}

type SimplePaginationValueProps = ComponentProps<"span">;

export function SimplePaginationValue(props: SimplePaginationValueProps) {
  const [, rest] = splitProps(props, ["class"]);

  return <span class={twCx("px-2", props.class)} {...rest} />;
}

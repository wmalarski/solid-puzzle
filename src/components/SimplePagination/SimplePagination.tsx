import type { VariantProps } from "class-variance-authority";

import {
  Accessor,
  Component,
  type ComponentProps,
  createContext,
  createMemo,
  splitProps,
  useContext
} from "solid-js";

import { useI18n } from "~/contexts/I18nContext";

import { buttonSplitProps } from "../Button/Button";
import { buttonClass } from "../Button/Button.recipe";
import { ArrowLeftIcon } from "../Icons/ArrowLeftIcon";
import { ArrowRightIcon } from "../Icons/ArrowRightIcon";
import { twCx } from "../utils/twCva";

type SimplePaginationContextValues = {
  count: number;
  page: number;
};

const SimplePaginationContext = createContext<
  Accessor<SimplePaginationContextValues>
>(() => {
  throw new Error("SimplePaginationContext not defined");
});

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
  VariantProps<typeof buttonClass>;

export const SimplePaginationPrevious: Component<PaginationLinkProps> = (
  props
) => {
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
};

export const SimplePaginationNext: Component<PaginationLinkProps> = (props) => {
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
};

type SimplePaginationValueProps = ComponentProps<"span">;

export const SimplePaginationValue: Component<SimplePaginationValueProps> = (
  props
) => {
  const [, rest] = splitProps(props, ["class"]);

  return <span class={twCx("px-2", props.class)} {...rest} />;
};

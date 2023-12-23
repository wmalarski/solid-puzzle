import { Meta, Title } from "@solidjs/meta";
import type { Component } from "solid-js";
import { useI18n } from "~/contexts/I18nContext";

export const Head: Component = () => {
  const { t } = useI18n();

  return (
    <>
      <Title>{t("home.title")}</Title>
      <Meta charset="utf-8" />
      <Meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  );
};

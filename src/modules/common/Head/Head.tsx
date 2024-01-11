import type { Component } from "solid-js";

import { Meta, Title } from "@solidjs/meta";

import { useI18n } from "~/contexts/I18nContext";

export const Head: Component = () => {
  const { t } = useI18n();

  return (
    <>
      <Title>{t("home.title")}</Title>
      <Meta charset="utf-8" />
      <Meta content="width=device-width, initial-scale=1" name="viewport" />
    </>
  );
};

import { useI18n } from "@solid-primitives/i18n";
import type { Component } from "solid-js";
import { Meta, Head as SolidHead, Title } from "solid-start";

export const Head: Component = () => {
  const [t] = useI18n();

  return (
    <SolidHead>
      <Title>{t("home.title")}</Title>
      <Meta charset="utf-8" />
      <Meta name="viewport" content="width=device-width, initial-scale=1" />
    </SolidHead>
  );
};

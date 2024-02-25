import { Meta, Title } from "@solidjs/meta";
import { type Component, createMemo } from "solid-js";
import { getRequestEvent } from "solid-js/web";

import { useI18n } from "~/contexts/I18nContext";

type HeadProps = {
  description?: string;
  title?: string;
};

export const Head: Component<HeadProps> = (props) => {
  const { t } = useI18n();

  const title = createMemo(() => {
    return props.title
      ? `${props.title} - ${t("home.title")}`
      : t("home.title");
  });

  const description = createMemo(() => {
    return props.description ?? t("home.title");
  });

  const url = createMemo(() => {
    const href = getRequestEvent()?.request.url || window.location.href;
    return new URL(href);
  });

  const ogUrl = createMemo(() => {
    return `${url().origin}${url().pathname}`;
  });

  return (
    <>
      <Title>{title()}</Title>
      <meta content={description()} name="description" />
      <meta content={title()} property="og:title" />
      <meta content={description()} property="og:description" />
      <meta content="website" property="og:type" />
      <meta content={ogUrl()} property="og:url" />
      <meta content={`${url().origin}/og-image.png`} property="og:image" />
      <meta content="461" property="og:image:width" />
      <meta content="460" property="og:image:height" />
    </>
  );
};

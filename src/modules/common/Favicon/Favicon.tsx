import { Meta, Title } from "@solidjs/meta";
import { useHref, useLocation } from "@solidjs/router";
import { type Component, createEffect, createMemo } from "solid-js";

import { useI18n } from "~/contexts/I18nContext";

type HeadProps = {
  description: string;
  title?: string;
};

export const Head: Component<HeadProps> = (props) => {
  const { t } = useI18n();

  const title = createMemo(() => {
    return props.title
      ? `${props.title} - ${t("home.title")}`
      : t("home.title");
  });

  // const image = createMemo(() => {
  //   return { height: 500, url: props.ogImage, width: 500 };
  // });

  const location = useLocation();
  const href = useHref(() => location.pathname);

  createEffect(() => {
    console.log("location", location, href());
  });

  return (
    <>
      <Title>{title()}</Title>
      <Meta charset="utf-8" />
      <Meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta content={props.description} name="description" />
      <meta content={title()} property="og:title" />
      <meta content={props.description} property="og:description" />
      <meta content="website" property="og:type" />
      <meta content={href()} property="og:url" />
      <meta content="/og-image.png" property="og:image" />
      <meta content="461" property="og:image:width" />
      <meta content="460" property="og:image:height" />
    </>
  );
};

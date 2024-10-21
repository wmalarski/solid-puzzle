import { Component, createSignal, For } from "solid-js";

import { twCx } from "~/components/utils/twCva";
import { useI18n } from "~/contexts/I18nContext";

import type { ImageEntry } from "./const";

import { IMAGES } from "./const";

type ImageGridProps = {
  disabled?: boolean;
  initialValue?: string;
  scrollable: boolean;
};

export const ImageGrid: Component<ImageGridProps> = (props) => {
  const { t } = useI18n();

  const [value, setValue] = createSignal(
    IMAGES.find((image) => image.path === props.initialValue) || IMAGES[0]
  );

  const onButtonClick = (image: ImageEntry) => () => {
    setValue(image);
  };

  return (
    <div class="max-h-96">
      <span class="label-text px-2 py-4">{t("createBoard.image")}</span>
      <input name="image" type="hidden" value={value().path} />
      <input name="width" type="hidden" value={value().width} />
      <input name="height" type="hidden" value={value().height} />
      <div
        class={twCx(
          "flex flex-col gap-1 overflow-x-hidden py-2",
          props.scrollable ? "h-96 overflow-y-scroll" : null
        )}
      >
        <For each={IMAGES}>
          {(image) => (
            <button
              class={twCx(
                "flex rounded border-2 border-base-300 p-2 items-center justify-center",
                value().path === image.path ? "border-accent bg-base-300" : null
              )}
              disabled={props.disabled}
              onClick={onButtonClick(image)}
              type="button"
            >
              <img alt={""} src={image.path} />
            </button>
          )}
        </For>
      </div>
    </div>
  );
};

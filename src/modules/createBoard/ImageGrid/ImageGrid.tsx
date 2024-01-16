import { type Component, For, createSignal } from "solid-js";

import { twCx } from "~/components/utils/twCva";
import { useI18n } from "~/contexts/I18nContext";
import { getImages } from "~/utils/images";

type ImageGridProps = {
  hasDefault?: boolean;
  name: string;
};

export const ImageGrid: Component<ImageGridProps> = (props) => {
  const { t } = useI18n();

  const images = getImages();

  const [value, setValue] = createSignal(images[0]);

  const onButtonClick = (image: string) => () => {
    setValue(image);
  };

  return (
    <div class="max-h-96">
      <span class="label-text px-2 py-4">{t("createBoard.image")}</span>
      <input name={props.name} type="hidden" value={value()} />
      <div class="flex h-96 flex-col gap-1 overflow-x-hidden overflow-y-scroll">
        <For each={images}>
          {(image) => (
            <button
              class={twCx(
                "flex rounded border-2 border-base-300 p-2 items-center justify-center",
                value() === image ? "border-accent bg-base-300" : null
              )}
              onClick={onButtonClick(image)}
              type="button"
            >
              <img alt={""} src={image} />
            </button>
          )}
        </For>
      </div>
    </div>
  );
};

import { useI18n } from "@solid-primitives/i18n";
import { createSignal, type Component, type JSX } from "solid-js";
import { cardTitleClass } from "~/components/Card";
import { insertBoardAction } from "~/server/board";
import { ImageGrid } from "./ImageGrid";

export const InsertBoard: Component = () => {
  const [t] = useI18n();

  const [insertBoard, { Form }] = insertBoardAction();

  const [image, setImage] = createSignal<string>();
  const [isModalOpen, setIsModalOpen] = createSignal(false);

  const onFormChange: JSX.IntrinsicElements["form"]["onChange"] = (event) => {
    const data = new FormData(event.currentTarget);
    const image = data.get("image") as string;
    setImage(image);
    setIsModalOpen(true);
  };

  return (
    <section>
      <header class="flex items-center justify-between gap-2">
        <h2 class={cardTitleClass()}>{t("createBoard.title")}</h2>
      </header>
      <form onChange={onFormChange}>
        <ImageGrid name="image" />
      </form>
    </section>
  );
};

import { createSignal, type Component, type JSX } from "solid-js";
import { cardTitleClass } from "~/components/Card";
import {
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "~/components/Dialog";
import { XIcon } from "~/components/Icons/XIcon";
import { useI18n } from "~/contexts/I18nContext";
import { CreateBoardForm } from "~/modules/createBoard/CreateBoardForm";
import { ImageGrid } from "~/modules/createBoard/ImageGrid";

type FormDialogProps = {
  image?: string;
  isOpen: boolean;
  onIsOpenChange: (isOpen: boolean) => void;
};

const FormDialog: Component<FormDialogProps> = (props) => {
  return (
    <DialogRoot open={props.isOpen} onOpenChange={props.onIsOpenChange}>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogPortal>
        <DialogOverlay />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>About Kobalte</DialogTitle>
              <DialogCloseButton>
                <XIcon />
              </DialogCloseButton>
            </DialogHeader>
            <DialogDescription>
              Kobalte is a UI toolkit for building accessible web apps and
              design systems with SolidJS. It provides a set of low-level UI
              components and primitives which can be the foundation for your
              design system implementation.
            </DialogDescription>
            <CreateBoardForm image={props.image} />
          </DialogContent>
        </DialogPositioner>
      </DialogPortal>
    </DialogRoot>
  );
};

export const InsertBoard: Component = () => {
  const { t } = useI18n();

  const [image, setImage] = createSignal<string>();
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [formRef, setFormRef] = createSignal<HTMLFormElement>();

  const onFormChange: JSX.IntrinsicElements["form"]["onChange"] = (event) => {
    const data = new FormData(event.currentTarget);
    const image = data.get("image") as string;
    setImage(image);
    setIsModalOpen(true);
  };

  const onIsOpenChange = (isOpen: boolean) => {
    setIsModalOpen(isOpen);
    formRef()?.reset();
  };

  return (
    <section>
      <header class="flex items-center justify-between gap-2">
        <h2 class={cardTitleClass()}>{t("createBoard.title")}</h2>
      </header>
      <form ref={setFormRef} onChange={onFormChange}>
        <ImageGrid name="image" />
      </form>
      <FormDialog
        image={image()}
        isOpen={isModalOpen()}
        onIsOpenChange={onIsOpenChange}
      />
    </section>
  );
};

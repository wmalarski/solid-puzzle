import { createMutation } from "@tanstack/solid-query";
import { Show, type Component, type JSX } from "solid-js";
import { Alert, AlertIcon } from "~/components/Alert";
import { Button } from "~/components/Button";
import { useI18n } from "~/contexts/I18nContext";
import { insertBoardServerAction } from "~/server/board/rpc";
import { ConfigFields } from "../ConfigFields";

type CreateBoardFormProps = {
  image?: string;
};

export const CreateBoardForm: Component<CreateBoardFormProps> = (props) => {
  const { t } = useI18n();

  const mutation = createMutation(() => ({
    mutationFn: insertBoardServerAction,
  }));

  const onSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    mutation.mutate(data);
  };

  return (
    <form onSubmit={onSubmit} class="flex flex-col gap-4" method="post">
      <Show when={mutation.data}>
        <Alert variant="error">
          <AlertIcon variant="error" />
          Error
        </Alert>
      </Show>
      <ConfigFields image={props.image} />
      <Button
        disabled={mutation.isPending}
        isLoading={mutation.isPending}
        type="submit"
      >
        {t("createBoard.button")}
      </Button>
    </form>
  );
};

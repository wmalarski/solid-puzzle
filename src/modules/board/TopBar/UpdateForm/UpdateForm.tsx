import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { Show, type Component, type JSX } from "solid-js";
import { Alert, AlertIcon } from "~/components/Alert";
import { Button } from "~/components/Button";
import { useI18n } from "~/contexts/I18nContext";
import { ConfigFields } from "~/modules/createBoard/ConfigFields";
import {
  invalidateSelectBoardQuery,
  invalidateSelectBoardsQueries,
} from "~/server/board/client";
import { updateBoardServerAction } from "~/server/board/rpc";

type UpdateFormProps = {
  boardId: string;
};

export const UpdateForm: Component<UpdateFormProps> = (props) => {
  const { t } = useI18n();

  const queryClient = useQueryClient();

  const mutation = createMutation(() => ({
    mutationFn: updateBoardServerAction,
    onSuccess() {
      queryClient.invalidateQueries(invalidateSelectBoardQuery(props.boardId));
      queryClient.invalidateQueries(invalidateSelectBoardsQueries());
    },
  }));

  const onSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    mutation.mutate(data);
  };

  return (
    <form onSubmit={onSubmit} class="flex flex-col gap-4" method="post">
      <Show when={mutation.data && mutation.data < 1}>
        <Alert variant="error">
          <AlertIcon variant="error" />
          Error
        </Alert>
      </Show>
      <input name="id" value={props.boardId} type="hidden" />
      <ConfigFields />
      <Button
        disabled={mutation.isPending}
        isLoading={mutation.isPending}
        type="submit"
      >
        {t("board.settings.update.button")}
      </Button>
    </form>
  );
};

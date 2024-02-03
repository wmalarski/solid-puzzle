import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { type Component, type ComponentProps, Show } from "solid-js";

import { Alert, AlertIcon } from "~/components/Alert";
import { Button } from "~/components/Button";
import { useI18n } from "~/contexts/I18nContext";
import { ConfigFields } from "~/modules/createBoard/ConfigFields";
import {
  invalidateSelectBoardQuery,
  invalidateSelectBoardsQueries
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
    }
  }));

  const onSubmit: ComponentProps<"form">["onSubmit"] = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    mutation.mutate(data);
  };

  return (
    <form class="flex flex-col gap-4" method="post" onSubmit={onSubmit}>
      <Show when={mutation.error}>
        <Alert variant="error">
          <AlertIcon variant="error" />
          Error
        </Alert>
      </Show>
      <input name="id" type="hidden" value={props.boardId} />
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

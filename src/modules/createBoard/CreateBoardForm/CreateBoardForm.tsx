import { useNavigate } from "@solidjs/router";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { type Component, type ComponentProps, Show } from "solid-js";

import { Alert, AlertIcon } from "~/components/Alert";
import { Button } from "~/components/Button";
import { useI18n } from "~/contexts/I18nContext";
import { insertBoardServerAction } from "~/server/board/rpc";
import { invalidateSelectBoardsQueries } from "~/services/board";
import { paths } from "~/utils/paths";

import { ConfigFields } from "../ConfigFields";

export const CreateBoardForm: Component = () => {
  const { t } = useI18n();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutation = createMutation(() => ({
    mutationFn: insertBoardServerAction,
    onSuccess(board) {
      navigate(paths.board(board.id));

      queryClient.invalidateQueries(invalidateSelectBoardsQueries());
    },
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
          {mutation.error?.message}
        </Alert>
      </Show>
      <ConfigFields />
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

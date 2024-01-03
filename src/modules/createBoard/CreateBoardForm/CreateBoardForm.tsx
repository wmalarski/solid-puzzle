import { useNavigate } from "@solidjs/router";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { Show, type Component, type JSX } from "solid-js";
import { Alert, AlertIcon } from "~/components/Alert";
import { Button } from "~/components/Button";
import { useI18n } from "~/contexts/I18nContext";
import { invalidateSelectBoardsQueries } from "~/server/board/client";
import { insertBoardServerAction } from "~/server/board/rpc";
import { paths } from "~/utils/paths";
import { ConfigFields } from "../ConfigFields";

export const CreateBoardForm: Component = () => {
  const { t } = useI18n();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutation = createMutation(() => ({
    mutationFn: insertBoardServerAction,
    onSettled(data, error, variables) {
      console.log({ data, error, variables });
    },
    onSuccess(board) {
      console.log("onSuccess", board);

      navigate(paths.board(board.id));

      queryClient.invalidateQueries(invalidateSelectBoardsQueries());
    },
  }));

  const onSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    console.log("onSubmit", Object.fromEntries(data.entries()));
    mutation.mutate(data);
  };

  return (
    <form onSubmit={onSubmit} class="flex flex-col gap-4" method="post">
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

import { makePersisted } from "@solid-primitives/storage";
import { useNavigate } from "@solidjs/router";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { decode } from "decode-formdata";
import {
  type Component,
  type ComponentProps,
  Show,
  createSignal,
} from "solid-js";

import { Alert, AlertIcon } from "~/components/Alert";
import { Button, LinkButton } from "~/components/Button";
import { useI18n } from "~/contexts/I18nContext";
import { useSessionContext } from "~/contexts/SessionContext";
import { insertBoardServerAction } from "~/server/board/rpc";
import { invalidateSelectBoardsQueries } from "~/services/board";
import { paths } from "~/utils/paths";

import { type BoardConfigFields, ConfigFields } from "../ConfigFields";

export const CreateBoardForm: Component = () => {
  const { t } = useI18n();

  const [ref, setRef] = createSignal<HTMLFormElement>();

  const session = useSessionContext();

  const [initial, setInitial] = makePersisted(
    // eslint-disable-next-line solid/reactivity
    createSignal<BoardConfigFields | null>(null),
    { name: "initialValues" },
  );

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

  const onUnauthorizedClick = () => {
    const form = ref();
    if (!form) {
      return;
    }

    const decoded = decode(new FormData(form), {
      numbers: ["rows", "columns"],
    });

    setInitial(decoded as BoardConfigFields);
  };

  return (
    <form
      class="flex flex-col gap-4"
      method="post"
      onSubmit={onSubmit}
      ref={setRef}
    >
      <Show when={mutation.error}>
        <Alert variant="error">
          <AlertIcon variant="error" />
          {mutation.error?.message}
        </Alert>
      </Show>
      <ConfigFields initialValues={initial()} />
      <Show
        fallback={
          <LinkButton href={paths.signIn} onClick={onUnauthorizedClick}>
            {t("createBoard.link")}
          </LinkButton>
        }
        when={session()}
      >
        <Button
          disabled={mutation.isPending}
          isLoading={mutation.isPending}
          type="submit"
        >
          {t("createBoard.button")}
        </Button>
      </Show>
    </form>
  );
};

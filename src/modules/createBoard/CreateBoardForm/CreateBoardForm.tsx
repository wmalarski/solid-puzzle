import { makePersisted } from "@solid-primitives/storage";
import { useAction, useSubmission } from "@solidjs/router";
import { useQueryClient } from "@tanstack/solid-query";
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
import {
  insertBoardAction,
  invalidateSelectBoardsQueries,
} from "~/services/board";
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

  const queryClient = useQueryClient();

  const action = useAction(insertBoardAction);
  const submission = useSubmission(insertBoardAction);

  const onSubmit: ComponentProps<"form">["onSubmit"] = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    await action(data);

    await queryClient.invalidateQueries(invalidateSelectBoardsQueries());
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
      action={insertBoardAction}
      class="flex flex-col gap-4"
      method="post"
      onSubmit={onSubmit}
      ref={setRef}
    >
      <Show when={submission.result?.error}>
        <Alert variant="error">
          <AlertIcon variant="error" />
          {submission.result?.error}
        </Alert>
      </Show>
      <ConfigFields
        errors={submission.result?.errors}
        initialValues={initial()}
      />
      <Show
        fallback={
          <LinkButton href={paths.signIn} onClick={onUnauthorizedClick}>
            {t("createBoard.link")}
          </LinkButton>
        }
        when={session()}
      >
        <Button
          disabled={submission.pending}
          isLoading={submission.pending}
          type="submit"
        >
          {t("createBoard.button")}
        </Button>
      </Show>
    </form>
  );
};

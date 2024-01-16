import { useAction, useSubmission } from "@solidjs/router";
import { useQueryClient } from "@tanstack/solid-query";
import { type Component, type ComponentProps, Show } from "solid-js";

import { Alert, AlertIcon } from "~/components/Alert";
import { Button } from "~/components/Button";
import { useI18n } from "~/contexts/I18nContext";
import { useSessionContext } from "~/contexts/SessionContext";
import {
  insertBoardAction,
  invalidateSelectBoardsQueries,
} from "~/server/board/client";

import { type BoardConfigFields, ConfigFields } from "../ConfigFields";

type CreateBoardFormProps = {
  initialValues?: BoardConfigFields | null;
};

export const CreateBoardForm: Component<CreateBoardFormProps> = (props) => {
  const { t } = useI18n();

  const session = useSessionContext();

  const queryClient = useQueryClient();

  const action = useAction(insertBoardAction);
  const submission = useSubmission(insertBoardAction);

  const onSubmit: ComponentProps<"form">["onSubmit"] = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    try {
      await action(data);
      await queryClient.invalidateQueries(invalidateSelectBoardsQueries());
    } catch {
      // handled by useSubmission
    }
  };

  return (
    <form
      action={insertBoardAction}
      class="flex flex-col gap-4"
      method="post"
      onSubmit={onSubmit}
    >
      <Show when={submission.result?.error}>
        <Alert variant="error">
          <AlertIcon variant="error" />
          {submission.result?.error}
        </Alert>
      </Show>
      <ConfigFields
        errors={submission.result?.errors}
        initialValues={props.initialValues}
      />
      <Button
        disabled={submission.pending}
        isLoading={submission.pending}
        type="submit"
      >
        <Show fallback={t("createBoard.link")} when={session()}>
          {t("createBoard.button")}
        </Show>
      </Button>
    </form>
  );
};

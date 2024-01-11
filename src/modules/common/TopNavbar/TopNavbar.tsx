import { revalidate, useNavigate } from "@solidjs/router";
import { createMutation } from "@tanstack/solid-query";
import { type Component, type ComponentProps, Show } from "solid-js";

import { Button, LinkButton } from "~/components/Button";
import { PuzzleIcon } from "~/components/Icons/PuzzleIcon";
import { Link } from "~/components/Link";
import { Navbar, NavbarEnd, NavbarStart } from "~/components/Navbar";
import { useI18n } from "~/contexts/I18nContext";
import { useSessionContext } from "~/contexts/SessionContext";
import { SESSION_CACHE_NAME } from "~/server/auth/client";
import { signOutServerAction } from "~/server/auth/rpc";
import { paths } from "~/utils/paths";

const SignOutButton: Component = () => {
  const { t } = useI18n();

  const navigate = useNavigate();

  const mutation = createMutation(() => ({
    mutationFn: signOutServerAction,
    async onSuccess() {
      await revalidate(SESSION_CACHE_NAME);
      navigate(paths.home);
    },
  }));

  const onSubmit: ComponentProps<"form">["onSubmit"] = (event) => {
    event.preventDefault();

    mutation.mutate();
  };

  return (
    <form method="post" onSubmit={onSubmit}>
      <Button disabled={mutation.isPending} size="sm">
        {t("auth.signOut")}
      </Button>
    </form>
  );
};

export const TopNavbar: Component = () => {
  const { t } = useI18n();

  const session = useSessionContext();

  return (
    <Navbar>
      <NavbarStart>
        <Link class="flex gap-2 text-3xl uppercase" hover href={paths.home}>
          <PuzzleIcon class="h-8 w-8" />
          {t("home.title")}
        </Link>
      </NavbarStart>
      <NavbarEnd>
        <Show
          fallback={
            <>
              <LinkButton href={paths.signUp} size="sm" variant="ghost">
                {t("home.signUp")}
              </LinkButton>
              <LinkButton href={paths.signIn} size="sm">
                {t("home.signIn")}
              </LinkButton>
            </>
          }
          when={session()}
        >
          <Link class="flex text-sm uppercase" hover href={paths.boards}>
            {t("home.boards")}
          </Link>
          <SignOutButton />
        </Show>
      </NavbarEnd>
    </Navbar>
  );
};

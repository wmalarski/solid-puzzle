import { HiOutlinePuzzlePiece } from "solid-icons/hi";
import { Show, type Component } from "solid-js";
import { Button, LinkButton } from "~/components/Button";
import { Link } from "~/components/Link";
import { Navbar, NavbarEnd, NavbarStart } from "~/components/Navbar";
import { useI18n } from "~/contexts/I18nContext";
import { useSessionContext } from "~/contexts/SessionContext";
import { createSignOutServerAction } from "~/server/auth/actions";
import { paths } from "~/utils/paths";

const SignOutButton: Component = () => {
  const { t } = useI18n();

  const [signOut, { Form }] = createSignOutServerAction();

  return (
    <Form>
      <Button size="sm" disabled={signOut.pending}>
        {t("auth.signOut")}
      </Button>
    </Form>
  );
};

export const TopNavbar: Component = () => {
  const { t } = useI18n();

  const session = useSessionContext();

  return (
    <Navbar>
      <NavbarStart>
        <Link class="flex text-3xl uppercase" hover href={paths.home}>
          <HiOutlinePuzzlePiece class="h-8 w-8" />
          {t("home.title")}
        </Link>
      </NavbarStart>
      <NavbarEnd>
        <Show
          when={session()}
          fallback={
            <>
              <LinkButton size="sm" variant="ghost" href={paths.signUp}>
                {t("home.signUp")}
              </LinkButton>
              <LinkButton size="sm" href={paths.signIn}>
                {t("home.signIn")}
              </LinkButton>
            </>
          }
        >
          <SignOutButton />
        </Show>
      </NavbarEnd>
    </Navbar>
  );
};

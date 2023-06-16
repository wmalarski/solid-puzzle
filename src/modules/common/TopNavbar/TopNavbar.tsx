import { useI18n } from "@solid-primitives/i18n";
import { HiOutlinePuzzlePiece } from "solid-icons/hi";
import type { Component } from "solid-js";
import { Button } from "~/components/Button";
import { Link } from "~/components/Link";
import { Navbar, NavbarEnd, NavbarStart } from "~/components/Navbar";
import { createSignOutServerAction } from "~/server/auth";
import { paths } from "~/utils/paths";

const SignOutButton: Component = () => {
  const [t] = useI18n();

  const [signOut, { Form }] = createSignOutServerAction();

  return (
    <Form>
      <Button disabled={signOut.pending}>{t("auth.signOut")}</Button>
    </Form>
  );
};

export const TopNavbar: Component = () => {
  const [t] = useI18n();

  return (
    <Navbar>
      <NavbarStart>
        <Link class="flex text-3xl uppercase" hover href={paths.home}>
          <HiOutlinePuzzlePiece class="h-8 w-8" />
          {t("home.title")}
        </Link>
      </NavbarStart>
      <NavbarEnd>
        <SignOutButton />
      </NavbarEnd>
    </Navbar>
  );
};

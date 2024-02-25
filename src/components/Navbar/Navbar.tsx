import type { Component, ComponentProps } from "solid-js";

import { twCx } from "../utils/twCva";

export type NavbarProps = ComponentProps<"nav">;

export function Navbar(props: NavbarProps) {
  return <nav {...props} class={twCx("navbar", props.class)} />;
}

export type NavbarStartProps = ComponentProps<"div">;

export const NavbarStart = (props: NavbarStartProps) => {
  return <div {...props} class={twCx("navbar-start", props.class)} />;
};

export type NavbarCenterProps = ComponentProps<"div">;

export const NavbarCenter = (props: NavbarCenterProps) => {
  return <div {...props} class={twCx("navbar-center", props.class)} />;
};

export type NavbarEndProps = ComponentProps<"div">;

export const NavbarEnd = (props: NavbarEndProps) => {
  return <div {...props} class={twCx("navbar-end gap-2", props.class)} />;
};

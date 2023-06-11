import { type Component, type JSX } from "solid-js";
import { twCx } from "../utils/twCva";

export type NavbarProps = JSX.IntrinsicElements["nav"];

export const Navbar: Component<NavbarProps> = (props) => {
  return <nav {...props} class={twCx("navbar", props.class)} />;
};

export type NavbarStartProps = JSX.IntrinsicElements["div"];

export const NavbarStart = (props: NavbarStartProps) => {
  return <div {...props} class={twCx("navbar-start", props.class)} />;
};

export type NavbarCenterProps = JSX.IntrinsicElements["div"];

export const NavbarCenter = (props: NavbarCenterProps) => {
  return <div {...props} class={twCx("navbar-center", props.class)} />;
};

export type NavbarEndProps = JSX.IntrinsicElements["div"];

export const NavbarEnd = (props: NavbarEndProps) => {
  return <div {...props} class={twCx("navbar-end", props.class)} />;
};

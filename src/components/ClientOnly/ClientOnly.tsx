import {
  createSignal,
  onMount,
  Show,
  type Component,
  type JSX,
} from "solid-js";

type Props = {
  children: JSX.Element;
};

export const ClientOnly: Component<Props> = (props) => {
  const [isMounted, setIsMounted] = createSignal(false);

  onMount(() => {
    setIsMounted(true);
  });

  return <Show when={isMounted()}>{props.children}</Show>;
};

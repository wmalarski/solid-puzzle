import {
  Accessor,
  createContext,
  createMemo,
  createSignal,
  ParentProps,
  useContext
} from "solid-js";

const createPreviewContext = () => {
  const [isPreviewVisible, setIsPreviewVisible] = createSignal(false);

  return { isPreviewVisible, setIsPreviewVisible };
};

const PreviewContext = createContext<
  Accessor<ReturnType<typeof createPreviewContext>>
>(() => {
  throw new Error("PreviewContext not defined");
});

export const usePreviewContext = () => {
  return useContext(PreviewContext);
};

export function PreviewContextProvider(props: ParentProps) {
  const value = createMemo(() => createPreviewContext());

  return (
    <PreviewContext.Provider value={value}>
      {props.children}
    </PreviewContext.Provider>
  );
}

import { createContext, createSignal, ParentProps, useContext } from "solid-js";

const createPreviewContext = () => {
  const [isPreviewVisible, setIsPreviewVisible] = createSignal(false);

  return { isPreviewVisible, setIsPreviewVisible };
};

type PreviewContextValue = ReturnType<typeof createPreviewContext>;

const PreviewContext = createContext<PreviewContextValue>({
  isPreviewVisible: () => false,
  setIsPreviewVisible: () => void 0
});

export const usePreviewContext = () => {
  return useContext(PreviewContext);
};

export function PreviewContextProvider(props: ParentProps) {
  const value = createPreviewContext();

  return (
    <PreviewContext.Provider value={value}>
      {props.children}
    </PreviewContext.Provider>
  );
}

import { createContext, useContext, type Component, type JSX } from "solid-js";

const createBoardThemeContext = () => {
  return {
    previewSpriteAlpha: 0.4,
    previewStrokeColor: 0x777777,
    previewStrokeWidth: 1,
    rotationAnchorColor: 0xaa3333,
    rotationAnchorRadius: 10,
  };
};

const BoardThemeContext = createContext<
  ReturnType<typeof createBoardThemeContext>
>(createBoardThemeContext());

export const useBoardTheme = () => {
  return useContext(BoardThemeContext);
};

type Props = {
  children: JSX.Element;
};

export const BoardThemeProvider: Component<Props> = (props) => {
  const value = createBoardThemeContext();

  return (
    <BoardThemeContext.Provider value={value}>
      {props.children}
    </BoardThemeContext.Provider>
  );
};

import { type Component, type JSX, createContext, useContext } from "solid-js";

const createBoardThemeContext = () => {
  return {
    fragmentBorderColor: 0xaaaaaa,
    fragmentBorderSelectedColor: 0xaaaa33,
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

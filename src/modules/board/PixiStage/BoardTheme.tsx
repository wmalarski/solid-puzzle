import { createContext, type JSX, useContext } from "solid-js";

const createBoardThemeContext = () => {
  return {
    backgroundDarkColor: 0x1d1d21,
    backgroundLightColor: 0xdddddd,
    cursorContainerZIndex: 5,
    cursorGraphicsZIndex: 6,
    cursorStrokeColor: 0xffffff,
    cursorTextZIndex: 7,
    fragmentBorderWidth: 4,
    fragmentLockedZIndex: 0,
    fragmentRemoteZIndex: 2,
    fragmentSelectedZIndex: 3,
    fragmentZIndex: 1,
    previewSpriteAlpha: 0.4,
    previewStrokeColor: 0x777777,
    previewStrokeWidth: 1,
    rotationAnchorColor: 0xffffff,
    rotationAnchorRadius: 15,
    rotationAnchorWidth: 2
  };
};

const BoardThemeContext = createContext<
  ReturnType<typeof createBoardThemeContext>
>(createBoardThemeContext());

export const useBoardTheme = () => {
  return useContext(BoardThemeContext);
};

type BoardThemeProviderProps = {
  children: JSX.Element;
};

export function BoardThemeProvider(props: BoardThemeProviderProps) {
  const value = createBoardThemeContext();

  return (
    <BoardThemeContext.Provider value={value}>
      {props.children}
    </BoardThemeContext.Provider>
  );
}

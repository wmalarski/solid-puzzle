import { type Component, type JSX, createContext, useContext } from "solid-js";

const createBoardThemeContext = () => {
  return {
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

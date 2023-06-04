export type Point2D = {
  x: number;
  y: number;
};

type TranslatePointArgs = {
  point: Point2D;
  shift: Point2D;
};

export const translatePoint = ({ point, shift }: TranslatePointArgs) => {
  return { x: point.x + shift.x, y: point.y + shift.y };
};

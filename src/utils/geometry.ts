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

type GetCenterFromPointsArgs = {
  points: Point2D[];
};

export const getCenterFromPoints = ({ points }: GetCenterFromPointsArgs) => {
  let sumX = 0;
  let sumY = 0;

  points.forEach(({ x, y }) => {
    sumX += x;
    sumY += y;
  });

  return { x: sumX / points.length, y: sumY / points.length };
};

export const getMinFromPoints = ({ points }: GetCenterFromPointsArgs) => {
  const x = points.sort((a, b) => a.x - b.x)[0].x;
  const y = points.sort((a, b) => a.y - b.y)[0].y;
  return { x, y };
};

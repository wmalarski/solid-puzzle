export type Point2D = {
  x: number;
  y: number;
};

export const sumPoint = (point: Point2D, other: Point2D) => {
  return { x: point.x + other.x, y: point.y + other.y };
};

export const subtractPoint = (point: Point2D, other: Point2D) => {
  return { x: point.x - other.x, y: point.y - other.y };
};

export const getDistance = (point: Point2D, other: Point2D) => {
  return Math.sqrt(
    Math.pow(point.x - other.x, 2) + Math.pow(point.y - other.y, 2)
  );
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

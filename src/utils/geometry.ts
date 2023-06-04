export type Point2D = {
  x: number;
  y: number;
};

export type Line2D = {
  a: number;
  b: number;
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

type LineFromPointsArgs = {
  p1: Point2D;
  p2: Point2D;
};

export const lineFromPoints = ({ p1, p2 }: LineFromPointsArgs) => {
  const b = p2.x === p1.x ? 0 : (p1.y * p2.x - p2.y * p1.x) / (p2.x - p1.x);
  const a = p2.x === 0 ? 0 : (p2.y - b) / p2.x;
  return { a, b };
};

type CrossPointsArgs = {
  center: Point2D;
  radius: number;
  line: Line2D;
};

export const crossPoints = ({ center, line, radius }: CrossPointsArgs) => {
  const k1 = 1 + line.a * line.a;
  const k2 = 2 * line.a * line.b - 2 * center.x - 2 * line.a * center.y;
  const k3 =
    center.x * center.x +
    line.b * line.b -
    2 * line.b * center.y +
    center.y * center.y -
    radius * radius;

  const delta = k2 * k2 - 4 * k1 * k3;

  if (delta < 0) {
    return [];
  }

  if (delta === 0) {
    const x = -line.b / (2 * line.a);
    return [{ x, y: line.a * x + line.b }];
  }

  const deltaSqrt = Math.sqrt(delta);
  const x1 = (-line.b - deltaSqrt) / (2 * line.a);
  const x2 = (-line.b + deltaSqrt) / (2 * line.a);

  return [
    { x: x1, y: line.a * x1 + line.b },
    { x: x2, y: line.a * x2 + line.b },
  ];
};

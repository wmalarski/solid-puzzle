export type Point2D = {
  x: number;
  y: number;
};

export type Line2D = {
  a: number;
  b: number;
};

export type Polynomial = {
  k1: number;
  k2: number;
  k3: number;
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

type GetDistanceArgs = {
  point1: Point2D;
  point2: Point2D;
};

export const getDistance = ({ point1, point2 }: GetDistanceArgs) => {
  const xDiff = Math.pow(point1.x - point2.x, 2);
  const yDiff = Math.pow(point1.y - point2.y, 2);
  return Math.sqrt(xDiff + yDiff);
};

type GetClosestPointArgs = {
  from: Point2D;
  points: Point2D[];
};

export const getClosestPoint = ({ from, points }: GetClosestPointArgs) => {
  const withDistance = points.map((point) => ({
    distance: getDistance({ point1: point, point2: from }),
    point,
  }));

  withDistance.sort((a, b) => a.distance - b.distance);

  return withDistance[0].point;
};

type PolynomialFromLineAndCircle = {
  center: Point2D;
  radius: number;
  line: Line2D;
};

export const polynomialFromLineAndCircle = ({
  center,
  line,
  radius,
}: PolynomialFromLineAndCircle) => {
  const k1 = 1 + line.a * line.a;
  const k2 = 2 * line.a * line.b - 2 * center.x - 2 * line.a * center.y;
  const k3 =
    center.x * center.x +
    line.b * line.b -
    2 * line.b * center.y +
    center.y * center.y -
    radius * radius;

  return { k1, k2, k3 };
};

type GetPolynomialValueArgs = {
  polynomial: Polynomial;
  x: number;
};

export const getPolynomialValue = ({
  polynomial,
  x,
}: GetPolynomialValueArgs) => {
  return x * x * polynomial.k1 + x * polynomial.k2 + polynomial.k3;
};

type SolvePolynomialArgs = {
  polynomial: Polynomial;
};

export const solvePolynomial = ({ polynomial }: SolvePolynomialArgs) => {
  const delta =
    polynomial.k2 * polynomial.k2 - 4 * polynomial.k1 * polynomial.k3;

  if (delta < 0) {
    return [];
  }

  if (delta === 0) {
    return [-polynomial.k2 / (2 * polynomial.k1)];
  }

  const deltaSqrt = Math.sqrt(delta);
  return [
    (-polynomial.k2 - deltaSqrt) / (2 * polynomial.k1),
    (-polynomial.k2 + deltaSqrt) / (2 * polynomial.k1),
  ];
};

type SolveCircleLineArgs = {
  center: Point2D;
  point: Point2D;
  radius: number;
};

export const solveCircleLine = ({
  center,
  point,
  radius,
}: SolveCircleLineArgs) => {
  const line = lineFromPoints({ p1: center, p2: point });

  const polynomial = polynomialFromLineAndCircle({ center, line, radius });

  const xValues = solvePolynomial({ polynomial });

  return xValues.map((x) => {
    return { x, y: line.a * x + line.b };
  });
};

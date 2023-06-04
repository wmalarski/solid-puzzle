import type { Point2D } from "~/utils/geometry";

type GetRandomInRangeArgs = {
  center: number;
  max: number;
  radius: number;
};

const getRandomInRange = ({ center, max, radius }: GetRandomInRangeArgs) => {
  const random = 2 * (Math.random() - 0.5) * radius;
  return Math.max(Math.min(center + random, max), 0);
};

type GetRandomGridPointArgs = {
  columnIndex: number;
  rowIndex: number;
  xCenter?: number;
  yCenter?: number;
};

type GetRandomGridPointFactoryArgs = {
  columns: number;
  height: number;
  rows: number;
  width: number;
};

const getRandomGridPointFactory = ({
  columns,
  height,
  rows,
  width,
}: GetRandomGridPointFactoryArgs) => {
  const columnWidth = width / columns;
  const rowHeight = height / rows;

  const xRadius = columnWidth / 4;
  const yRadius = rowHeight / 4;

  return ({
    columnIndex,
    rowIndex,
    xCenter,
    yCenter,
  }: GetRandomGridPointArgs) => {
    const isBorderRow = rowIndex === 0 || rowIndex === rows;
    const isBorderColumn = columnIndex === 0 || columnIndex === columns;
    const xColumnCenter = columnIndex * columnWidth;
    const yColumnCenter = rowIndex * rowHeight;

    const x = isBorderColumn
      ? xColumnCenter
      : getRandomInRange({
          center: xCenter ?? xColumnCenter,
          max: width,
          radius: xRadius,
        });

    const y = isBorderRow
      ? yColumnCenter
      : getRandomInRange({
          center: yCenter ?? yColumnCenter,
          max: height,
          radius: yRadius,
        });

    return { x, y };
  };
};

type GenerateCurvesArgs = {
  columns: number;
  height: number;
  rows: number;
  width: number;
};

const generateCurves = ({
  columns,
  height,
  rows,
  width,
}: GenerateCurvesArgs) => {
  const getRandomGridPoint = getRandomGridPointFactory({
    columns,
    height,
    rows,
    width,
  });

  const points = Array(rows + 1)
    .fill(0)
    .map((_value, rowIndex) =>
      Array(columns + 1)
        .fill(0)
        .map((_value, columnIndex) =>
          getRandomGridPoint({ columnIndex, rowIndex })
        )
    );

  const horizontalLines = Array(rows + 1)
    .fill(0)
    .map((_value, rowIndex) =>
      Array(columns)
        .fill(0)
        .map((_value, columnIndex) => {
          const start = points[rowIndex][columnIndex];
          const end = points[rowIndex][columnIndex + 1];
          const center = getRandomGridPoint({
            columnIndex,
            rowIndex,
            xCenter: (start.x + end.x) / 2,
            yCenter: (start.y + end.y) / 2,
          });
          return { center, end, start };
        })
    );

  const verticalLines = Array(rows)
    .fill(0)
    .map((_value, rowIndex) =>
      Array(columns + 1)
        .fill(0)
        .map((_value, columnIndex) => {
          const start = points[rowIndex][columnIndex];
          const end = points[rowIndex + 1][columnIndex];
          const center = getRandomGridPoint({
            columnIndex,
            rowIndex,
            xCenter: (start.x + end.x) / 2,
            yCenter: (start.y + end.y) / 2,
          });
          return { center, end, start };
        })
    );

  return { horizontalLines, verticalLines };
};

type GetCenterFromPointsArgs = {
  points: Point2D[];
};

const getCenterFromPoints = ({ points }: GetCenterFromPointsArgs) => {
  let sumX = 0;
  let sumY = 0;

  points.forEach(({ x, y }) => {
    sumX += x;
    sumY += y;
  });

  return { x: sumX / points.length, y: sumY / points.length };
};

const getMinFromPoints = ({ points }: GetCenterFromPointsArgs) => {
  const x = points.sort((a, b) => a.x - b.x)[0].x;
  const y = points.sort((a, b) => a.y - b.y)[0].y;

  console.log({ points, x, y });

  return { x, y };
};

type GetPuzzleFragmentsArgs = {
  columns: number;
  height: number;
  rows: number;
  width: number;
};

export const getPuzzleFragments = ({
  columns,
  height,
  rows,
  width,
}: GetPuzzleFragmentsArgs) => {
  const { horizontalLines, verticalLines } = generateCurves({
    columns,
    height,
    rows,
    width,
  });

  return Array(rows)
    .fill(0)
    .flatMap((_value, rowIndex) =>
      Array(columns)
        .fill(0)
        .map((_value, columnIndex) => {
          const top = horizontalLines[rowIndex][columnIndex];
          const bottom = horizontalLines[rowIndex + 1][columnIndex];
          const left = verticalLines[rowIndex][columnIndex];
          const right = verticalLines[rowIndex][columnIndex + 1];

          const curvePoints = [
            { control: left.center, to: left.end },
            { control: bottom.center, to: bottom.end },
            { control: right.center, to: right.start },
            { control: top.center, to: top.start },
          ];

          const points = curvePoints.map((curve) => curve.to);
          const min = getMinFromPoints({ points });
          // const shift = { x: -min.x, y: -min.y };

          // const translated = curvePoints.map((curve) => ({
          //   control: translatePoint({ point: curve.control, shift }),
          //   to: translatePoint({ point: curve.control, shift }),
          // }));
          // const center = translatePoint({
          //   point: getCenterFromPoints({ points }),
          //   shift,
          // });
          const center = getCenterFromPoints({ points });

          return {
            center,
            curvePoints,
            fragmentId: `${rowIndex}-${columnIndex}`,
            min,
            start: left.start,
            // translated,
          };
        })
    );
};

export type PuzzleFragmentShape = ReturnType<typeof getPuzzleFragments>[0];

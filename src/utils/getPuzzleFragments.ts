import {
  getCenterFromPoints,
  getMinMaxFromPoints,
  subtractPoint,
} from "~/utils/geometry";

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

type GetFragmentIdArgs = {
  columnIndex: number;
  rowIndex: number;
};

const getFragmentId = ({ columnIndex, rowIndex }: GetFragmentIdArgs) => {
  return `${rowIndex}-${columnIndex}`;
};

type GenerateCurvesArgs = {
  columns: number;
  height: number;
  rows: number;
  width: number;
};

export const generateCurves = ({
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
          const center = getCenterFromPoints([start, end]);
          const random = getRandomGridPoint({
            columnIndex,
            rowIndex,
            xCenter: center.x,
            yCenter: center.y,
          });
          return { center: random, end, start };
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
          const center = getCenterFromPoints([start, end]);
          const random = getRandomGridPoint({
            columnIndex,
            rowIndex,
            xCenter: center.x,
            yCenter: center.y,
          });
          return { center: random, end, start };
        })
    );

  return { horizontalLines, version: "1", verticalLines };
};

export type PuzzleCurveConfig = ReturnType<typeof generateCurves>;

export const getPuzzleFragments = ({
  horizontalLines,
  verticalLines,
}: PuzzleCurveConfig) => {
  const lines = [...horizontalLines, ...verticalLines].flat();

  const fragments = Array(horizontalLines.length - 1)
    .fill(0)
    .flatMap((_value, rowIndex) =>
      Array(verticalLines.length - 1)
        .fill(0)
        .map((_value, columnIndex) => {
          const top = horizontalLines[rowIndex][columnIndex];
          const bottom = horizontalLines[rowIndex + 1][columnIndex];
          const left = verticalLines[rowIndex][columnIndex];
          const right = verticalLines[rowIndex][columnIndex + 1];

          const absoluteCurvePoints = [
            { control: left.center, to: left.end },
            { control: bottom.center, to: bottom.end },
            { control: right.center, to: right.start },
            { control: top.center, to: top.start },
          ];

          const points = absoluteCurvePoints.flatMap((curve) => [
            curve.control,
            curve.to,
          ]);
          const { max, min } = getMinMaxFromPoints(points);
          const center = getCenterFromPoints([max, min]);

          const curvePoints = absoluteCurvePoints.map((curve) => ({
            control: subtractPoint(curve.control, min),
            to: subtractPoint(curve.to, min),
          }));

          return {
            center,
            curvePoints,
            fragmentId: getFragmentId({ columnIndex, rowIndex }),
            initialRotation: 2 * Math.random() * Math.PI,
            max,
            min,
          };
        })
    );

  return { fragments, lines };
};

export type PuzzleFragmentShape = ReturnType<
  typeof getPuzzleFragments
>["fragments"][0];

export type PuzzleShapeLine = ReturnType<typeof getPuzzleFragments>["lines"][0];

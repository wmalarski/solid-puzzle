import {
  type Point2D,
  getCenterFromPoints,
  getMinMaxFromPoints,
  scaleBy,
  subtractPoint
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
  rows: number;
};

const getRandomGridPointFactory = ({
  columns,
  rows
}: GetRandomGridPointFactoryArgs) => {
  const columnWidth = 1 / columns;
  const rowHeight = 1 / rows;

  const xRadius = columnWidth / 4;
  const yRadius = rowHeight / 4;

  return ({
    columnIndex,
    rowIndex,
    xCenter,
    yCenter
  }: GetRandomGridPointArgs) => {
    const isBorderRow = rowIndex === 0 || rowIndex === rows;
    const isBorderColumn = columnIndex === 0 || columnIndex === columns;
    const xColumnCenter = columnIndex * columnWidth;
    const yColumnCenter = rowIndex * rowHeight;

    const x = isBorderColumn
      ? xColumnCenter
      : getRandomInRange({
          center: xCenter ?? xColumnCenter,
          max: 1,
          radius: xRadius
        });

    const y = isBorderRow
      ? yColumnCenter
      : getRandomInRange({
          center: yCenter ?? yColumnCenter,
          max: 1,
          radius: yRadius
        });

    return { x, y };
  };
};

type GenerateCurvesArgs = {
  columns: number;
  rows: number;
};

export const generateCurves = ({ columns, rows }: GenerateCurvesArgs) => {
  const getRandomGridPoint = getRandomGridPointFactory({ columns, rows });

  const points = Array.from({ length: rows + 1 }, (_, rowIndex) =>
    Array.from({ length: columns + 1 }, (_, columnIndex) =>
      getRandomGridPoint({ columnIndex, rowIndex })
    )
  );

  const horizontalLines = Array.from({ length: rows + 1 }, (_, rowIndex) =>
    Array.from({ length: columns }, (_, columnIndex) => {
      const start = points[rowIndex][columnIndex];
      const end = points[rowIndex][columnIndex + 1];
      const center = getCenterFromPoints([start, end]);
      const random = getRandomGridPoint({
        columnIndex,
        rowIndex,
        xCenter: center.x,
        yCenter: center.y
      });
      return { center: random, end, start };
    })
  );

  const verticalLines = Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: columns + 1 }, (_, columnIndex) => {
      const start = points[rowIndex][columnIndex];
      const end = points[rowIndex + 1][columnIndex];
      const center = getCenterFromPoints([start, end]);
      const random = getRandomGridPoint({
        columnIndex,
        rowIndex,
        xCenter: center.x,
        yCenter: center.y
      });
      return { center: random, end, start };
    })
  );

  return { horizontalLines, version: "1", verticalLines };
};

export type PuzzleCurveConfig = ReturnType<typeof generateCurves>;
export type PuzzleCurve = PuzzleCurveConfig["horizontalLines"][0][0];

type GetInitialFragmentStateArgs = {
  columns: number;
  height: number;
  rows: number;
  width: number;
};

export const getInitialFragmentState = ({
  columns,
  height,
  rows,
  width
}: GetInitialFragmentStateArgs) => {
  return Array.from({ length: columns * rows }, (_, index) => ({
    index,
    rotation: 2 * Math.random() * Math.PI,
    x: 2 * Math.random() * width - width / 2,
    y: 2 * Math.random() * height + height / 2
  }));
};

type ScaleCurveUpArgs = {
  curve: PuzzleCurve;
  scale: Point2D;
};

const scaleCurveUp = ({ curve, scale }: ScaleCurveUpArgs): PuzzleCurve => {
  return {
    center: scaleBy(curve.center, scale),
    end: scaleBy(curve.end, scale),
    start: scaleBy(curve.start, scale)
  };
};

type ScaleConfigUpArgs = {
  config: PuzzleCurveConfig;
  scale: Point2D;
};

const scaleConfigUp = ({
  config,
  scale
}: ScaleConfigUpArgs): PuzzleCurveConfig => {
  return {
    ...config,
    horizontalLines: config.horizontalLines.map((lines) =>
      lines.map((curve) => scaleCurveUp({ curve, scale }))
    ),
    verticalLines: config.verticalLines.map((lines) =>
      lines.map((curve) => scaleCurveUp({ curve, scale }))
    )
  };
};

type GetPuzzleFragmentsArgs = {
  config: PuzzleCurveConfig;
  height: number;
  width: number;
};

export const getPuzzleFragments = ({
  config,
  height,
  width
}: GetPuzzleFragmentsArgs) => {
  const scale = { x: width, y: height };
  const { horizontalLines, verticalLines } = scaleConfigUp({ config, scale });
  const lines = [...horizontalLines, ...verticalLines].flat();

  const rows = horizontalLines.length - 1;
  const columns = verticalLines[0].length - 1;

  const fragments = Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: columns }, (_, columnIndex) => {
      const index = rowIndex * rows + columnIndex;

      const top = horizontalLines[rowIndex][columnIndex];
      const bottom = horizontalLines[rowIndex + 1][columnIndex];
      const left = verticalLines[rowIndex][columnIndex];
      const right = verticalLines[rowIndex][columnIndex + 1];

      const absoluteCurvePoints = [
        { control: left.center, to: left.end },
        { control: bottom.center, to: bottom.end },
        { control: right.center, to: right.start },
        { control: top.center, to: top.start }
      ];

      const points = absoluteCurvePoints.flatMap((curve) => [
        curve.control,
        curve.to
      ]);
      const { max, min } = getMinMaxFromPoints(points);
      const center = getCenterFromPoints([max, min]);

      const curvePoints = absoluteCurvePoints.map((curve) => ({
        control: subtractPoint(curve.control, min),
        to: subtractPoint(curve.to, min)
      }));

      return { center, curvePoints, index, max, min };
    })
  ).flat();

  return { fragments, lines };
};

export type PuzzleConfig = ReturnType<typeof getPuzzleFragments>;

export type PuzzleFragmentShape = PuzzleConfig["fragments"][0];

export type PuzzleShapeLine = PuzzleConfig["lines"][0];

type GenerateRandomInRangeArgs = {
  center: number;
  max: number;
  radius: number;
};

const generateRandomInRange = ({
  center,
  max,
  radius,
}: GenerateRandomInRangeArgs) => {
  const random = 2 * (Math.random() - 0.5) * radius;
  return Math.max(Math.min(center + random, max), 0);
};

type GenerateRandomRowPointsArgs = {
  columns: number;
  height: number;
  rowIndex: number;
  rows: number;
  width: number;
};

const generateRandomRowPoints = ({
  columns,
  height,
  rowIndex,
  rows,
  width,
}: GenerateRandomRowPointsArgs) => {
  const columnWidth = width / columns;
  const rowHeight = height / rows;

  const xRadius = columnWidth / 3;
  const yRadius = rowHeight / 3;

  const isBorderRow = rowIndex === 0 || rowIndex === rows;

  return Array(columns + 1)
    .fill(0)
    .map((_value, columnIndex) => {
      const isBorderColumn = columnIndex === 0 || columnIndex === columns;
      const xCenter = columnIndex * columnWidth;
      const yCenter = rowIndex * rowHeight;

      return {
        x: isBorderColumn
          ? xCenter
          : generateRandomInRange({
              center: xCenter,
              max: width,
              radius: xRadius,
            }),
        y: isBorderRow
          ? yCenter
          : generateRandomInRange({
              center: yCenter,
              max: height,
              radius: yRadius,
            }),
      };
    });
};

type GenerateRandomRowsPointsArgs = {
  columns: number;
  height: number;
  rows: number;
  width: number;
};

const generateRandomRowsPoints = ({
  columns,
  height,
  rows,
  width,
}: GenerateRandomRowsPointsArgs) => {
  return Array(rows + 1)
    .fill(0)
    .map((_value, rowIndex) =>
      generateRandomRowPoints({
        columns,
        height,
        rowIndex,
        rows,
        width,
      })
    );
};

type GenerateCurvesArgs = {
  points: ReturnType<typeof generateRandomRowsPoints>;
};

const generateCurves = ({ points }: GenerateCurvesArgs) => {
  const rows = points.length - 1;
  const columns = points[0].length - 1;

  const horizontalLines = Array(rows + 1)
    .fill(0)
    .map((_value, rowIndex) =>
      Array(columns)
        .fill(0)
        .map((_value, columnIndex) => {
          const start = points[rowIndex][columnIndex];
          const end = points[rowIndex][columnIndex + 1];

          const x = (start.x + end.x) / 2;
          const y = (start.y + end.y) / 2;

          return { center: { x, y }, end, start };
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

          const x = (start.x + end.x) / 2;
          const y = (start.y + end.y) / 2;

          return { center: { x, y }, end, start };
        })
    );

  return { horizontalLines, verticalLines };
};

type GeneratePuzzleFragmentsArgs = {
  columns: number;
  height: number;
  rows: number;
  width: number;
};

export const generatePuzzleFragments = ({
  columns,
  height,
  rows,
  width,
}: GeneratePuzzleFragmentsArgs) => {
  const points = generateRandomRowsPoints({
    columns,
    height,
    rows,
    width,
  });

  const { horizontalLines, verticalLines } = generateCurves({
    points,
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

          return {
            bottom,
            left,
            right: { ...right, end: right.start, start: right.end },
            top: { ...top, end: top.start, start: top.end },
          };
        })
    );
};

export type PuzzleFragmentShape = ReturnType<typeof generatePuzzleFragments>[0];

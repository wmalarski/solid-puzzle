import {
  getCenterFromPoints,
  getDistance,
  getMinFromPoints,
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

type GetNeighborsIdsArgs = {
  columnIndex: number;
  rowIndex: number;
};

type GetNeighborsIdsFactoryArgs = {
  columns: number;
  rows: number;
};

const getNeighborsIdsFactory = ({
  columns,
  rows,
}: GetNeighborsIdsFactoryArgs) => {
  return ({ columnIndex, rowIndex }: GetNeighborsIdsArgs) => {
    const ids: string[] = [];

    if (rowIndex > 0) {
      ids.push(getFragmentId({ columnIndex, rowIndex: rowIndex - 1 }));
    }
    if (rowIndex < rows - 1) {
      ids.push(getFragmentId({ columnIndex, rowIndex: rowIndex + 1 }));
    }
    if (columnIndex > 0) {
      ids.push(getFragmentId({ columnIndex: columnIndex - 1, rowIndex }));
    }
    if (columnIndex < columns - 1) {
      ids.push(getFragmentId({ columnIndex: columnIndex + 1, rowIndex }));
    }

    return ids;
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
          const center = getCenterFromPoints({ points: [start, end] });
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
          const center = getCenterFromPoints({ points: [start, end] });
          const random = getRandomGridPoint({
            columnIndex,
            rowIndex,
            xCenter: center.x,
            yCenter: center.y,
          });
          return { center: random, end, start };
        })
    );

  return { horizontalLines, verticalLines };
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
  const getNeighborsIds = getNeighborsIdsFactory({ columns, rows });
  const { horizontalLines, verticalLines } = generateCurves({
    columns,
    height,
    rows,
    width,
  });

  const fragments = Array(rows)
    .fill(0)
    .flatMap((_value, rowIndex) =>
      Array(columns)
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

          const points = absoluteCurvePoints.map((curve) => curve.to);
          const min = getMinFromPoints({ points });

          const curvePoints = absoluteCurvePoints.map((curve) => ({
            control: subtractPoint(curve.control, min),
            to: subtractPoint(curve.to, min),
          }));

          const absoluteCenter = getCenterFromPoints({ points });
          const center = subtractPoint(absoluteCenter, min);
          const neighbors = getNeighborsIds({ columnIndex, rowIndex });

          return {
            center,
            curvePoints,
            fragmentId: getFragmentId({ columnIndex, rowIndex }),
            min,
            neighbors,
            start: left.start,
          };
        })
    );

  const fragmentMap = new Map(
    fragments.map((fragment) => [fragment.fragmentId, fragment])
  );

  const withNeighbors = fragments.map((fragment) => {
    const neighbors = fragment.neighbors.flatMap((id) => {
      const neighbor = fragmentMap.get(id);
      if (!neighbor) {
        return [];
      }
      const shift = subtractPoint(fragment.start, neighbor.start);
      const distance = getDistance(fragment.start, neighbor.start);
      return [{ distance, id, shift, start: neighbor.start }];
    });
    return { ...fragment, neighbors };
  });

  return withNeighbors;
};

export type PuzzleFragmentShape = ReturnType<typeof getPuzzleFragments>[0];

export type PuzzleFragmentNeighbors = PuzzleFragmentShape["neighbors"];

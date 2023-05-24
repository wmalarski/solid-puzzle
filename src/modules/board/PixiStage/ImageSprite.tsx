import * as PIXI from "pixi.js";
import {
  createEffect,
  createResource,
  onCleanup,
  onMount,
  type Component,
} from "solid-js";
import { usePixiApp } from "./PixiApp";

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
  const points = generateRandomRowsPoints({
    columns,
    height,
    rows,
    width,
  });

  console.log({ points });
};

type Props = {
  path: string;
};

export const ImageSprite: Component<Props> = (props) => {
  const app = usePixiApp();

  const [resource] = createResource(async () => {
    const asset = await PIXI.Assets.load(props.path);
    return new PIXI.Sprite(asset);
  });

  createEffect(() => {
    const sprite = resource();

    if (!sprite) {
      return;
    }

    generateCurves({
      columns: 8,
      height: sprite.height,
      rows: 5,
      width: sprite.width,
    });

    const mask = new PIXI.Graphics();
    mask.beginFill(0x00ff00);
    // mask.drawEllipse(205, 230, 160, 140);

    mask.moveTo(100, 100);
    mask.quadraticCurveTo(125, 150, 100, 200);
    mask.quadraticCurveTo(150, 225, 200, 200);
    mask.quadraticCurveTo(225, 150, 200, 100);
    mask.quadraticCurveTo(150, 75, 100, 100);

    sprite.mask = mask;

    onMount(() => {
      app().stage.addChildAt(sprite, 0);
      app().stage.addChild(mask);
    });
    onCleanup(() => {
      app().stage.removeChild(sprite);
      app().stage.removeChild(mask);
    });
  });

  return null;
};

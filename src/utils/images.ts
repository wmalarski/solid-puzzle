const getImage = () => {
  const seed = `${Math.floor(Math.random() * 1e10)}`;
  const isVertical = Math.random() < 0.5;
  const size = isVertical ? "200/300" : "400/300";
  return `https://picsum.photos/seed/${seed}/${size}`;
};

export const getImages = () => {
  return Array(20)
    .fill(0)
    .map(() => getImage());
};

export const getImageShape = (path: string) => {
  const paths = path.split("/");
  const [width, height] = paths.slice(paths.length - 2);
  return { height: +height, width: +width };
};

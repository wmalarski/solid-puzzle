const getImage = () => {
  const seed = `${Math.floor(Math.random() * 1e10)}`;
  const isVertical = Math.random() < 0.5;
  const size = isVertical ? "200/300" : "400/300";
  return `https://picsum.photos/seed/${seed}/${size}`;
};

export const getImages = () => {
  return Array.from({ length: 20 }, () => getImage());
};

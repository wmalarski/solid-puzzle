const getImage = () => {
  const seed = `${Math.floor(Math.random() * 1e10)}`;
  const isVertical = Math.random() < 0.5;
  const size = isVertical ? "200/300" : "300/200";
  return `https://picsum.photos/seed/${seed}/${size}`;
};

export const images = Array(20)
  .fill(0)
  .map(() => getImage());

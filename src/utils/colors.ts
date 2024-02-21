export const randomHexColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor}`.padEnd(7, "0");
};

const getRGB = (color: string) => {
  return parseInt(color, 16) || Number(color);
};

const getsRGB = (color: string) => {
  return getRGB(color) / 255 <= 0.03928
    ? getRGB(color) / 255 / 12.92
    : Math.pow((getRGB(color) / 255 + 0.055) / 1.055, 2.4);
};

const getLuminance = (hexColor: string) => {
  return (
    0.2126 * getsRGB(hexColor.slice(1, 3)) +
    0.7152 * getsRGB(hexColor.slice(3, 5)) +
    0.0722 * getsRGB(hexColor.slice(5, 7))
  );
};

const getContrast = (foreground: string, background: string) => {
  const luminance1 = getLuminance(foreground);
  const luminance2 = getLuminance(background);
  return (
    (Math.max(luminance1, luminance2) + 0.05) /
    (Math.min(luminance1, luminance2) + 0.05)
  );
};

export const getTextColor = (bgColor: string) => {
  const whiteContrast = getContrast(bgColor, "#ffffff");
  const blackContrast = getContrast(bgColor, "#000000");

  return whiteContrast > blackContrast ? "#ffffff" : "#000000";
};

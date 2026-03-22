export const getSizeClass = (size: "small" | "middle" | "large"): string => {
  const sizeMap: Record<string, string> = {
    small: "24px",
    middle: "32px",
    large: "40px"
  };
  return sizeMap[size] || sizeMap.large;
};

export const generateArray = (size: number) =>
  Array.from({ length: size }, () => Math.floor(Math.random() * 300) + 10);

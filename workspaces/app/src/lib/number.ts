export const clamp = (nummber: number, min: number, max: number) => {
  return Math.min(Math.max(nummber, min), max);
};

export const round = (number, precision = 0) => {
  const multiplier = 10 ** precision;

  return Math.round(number * multiplier) / multiplier;
};

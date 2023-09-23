import { round } from 'lodash';

/**
 * The function `fractionToPercent` takes a numerator and denominator and returns the percentage
 * representation of the fraction.
 * @param {number} numerator - The numerator is the top number in a fraction. It represents the part of
 * the whole that you are interested in.
 * @param {number} denominator - The denominator is the number that the numerator is being divided by
 * in order to calculate the fraction. It represents the total number of equal parts that make up the
 * whole.
 * @returns a number, which is the decimal value converted to a percentage.
 */
export function fractionToPercent(
  numerator: number,
  denominator: number,
): number {
  if (!denominator) {
    return 0;
  }

  const decimal = numerator / denominator;
  return round(decimal, 2);
}

/**
 * The function removes all non-numeric characters from a given text, except for the leading + or -
 * sign and the first decimal point.
 * @param {string} text - The `text` parameter is a string that represents the text from which you want
 * to remove non-numeric characters.
 * @returns The function `removeNonNumericChars` returns a string with all non-numeric characters
 * removed.
 */
function removeNonNumericChars(text: string): string {
  let decimalCount = 0;
  let result = text.replace(/[^\d.]/g, (match: string, index: number) => {
    if ((match === '+' || match === '-') && index === 0) {
      return match;
    }

    // Keep the first decimal point
    if (match === '.' && decimalCount === 0) {
      decimalCount++;
      return match;
    }
    // Remove all other non-numeric characters
    return '';
  });

  // Remove all characters after the second decimal point
  const secondDecimalIndex = result.indexOf('.', result.indexOf('.') + 1);
  if (secondDecimalIndex !== -1) {
    result = result.substring(0, secondDecimalIndex);
  }

  return result;
}

/**
 * The `toNumber` function takes in an optional string value and returns the numeric value of the
 * string after removing any non-numeric characters.
 * @param {null | string} [value] - The `value` parameter is an optional parameter that can be either
 * `null` or a string.
 * @returns a number.
 */
export function toNumber(value?: null | string): number {
  if (!value) {
    return 0;
  }

  const numericString = removeNonNumericChars(value);
  const number = Number(numericString);
  return Number.isNaN(number) ? 0 : number;
}

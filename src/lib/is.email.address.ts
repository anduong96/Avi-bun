/**
 * The function checks if a given string is a valid email address using a regular expression.
 * @param {string} [value] - The value parameter is a string that represents an email address. It is an
 * optional parameter, which means that it can be undefined or null.
 * @returns The `isEmailAddress` function returns a boolean value indicating whether the input `value`
 * matches the format of a valid email address. It returns `true` if the input matches the regular
 * expression for a valid email address, and `false` otherwise.
 */
export function isEmailAddress(value?: string) {
  if (!value) {
    return false;
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email format regular expression
  return regex.test(value);
}

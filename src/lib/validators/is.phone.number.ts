/**
 * The function checks if a given string is a valid phone number in E.164 format.
 * @param {string} [phoneNumber] - The `phoneNumber` parameter is a string that represents a phone
 * number in E.164 format. The function `isPhoneNumber` checks if the provided `phoneNumber` is a valid
 * phone number in E.164 format or not.
 * @returns The function `isPhoneNumber` returns a boolean value. It returns `true` if the
 * `phoneNumber` parameter is a valid phone number in E.164 format, and `false` otherwise. If the
 * `phoneNumber` parameter is not provided or is an empty string, the function also returns `false`.
 */
export function isPhoneNumber(phoneNumber?: string): boolean {
  if (!phoneNumber) {
    return false;
  }

  const regEx = /^\+[1-9]\d{10,14}$/;
  return regEx.test(phoneNumber);
}

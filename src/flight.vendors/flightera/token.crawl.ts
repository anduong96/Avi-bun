/**
 * The function `getAuthToken` extracts the value of a token from a given HTML string.
 * @param {string} html - The `html` parameter is a string that represents the HTML content of a web
 * page.
 * @returns the value of the token found in the HTML string.
 */
export function getAuthToken(html: string) {
  const tokenMatch = html.match(/setCookie\('token', '([^']+)'/);
  if (!tokenMatch) {
    throw new Error('No token found');
  }

  const tokenValue = tokenMatch[1];
  return tokenValue;
}

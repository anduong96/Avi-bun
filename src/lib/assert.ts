/**
 * The `assert` function in TypeScript is used to check if a condition is true, and if not, it throws
 * an error with an optional error message.
 * @param {unknown} condition - The `condition` parameter is the expression or value that you want to
 * assert to be true. If the condition is false, an error will be thrown.
 * @param {Error | string} message - The `message` parameter can be either an `Error` object or a
 * string. It is used to provide additional information about the assertion failure. If the `message`
 * is a string, it will be converted into an `Error` object before being thrown.
 */
export function assert(
  condition: unknown,
  message?: Error | string,
): asserts condition {
  if (!condition) {
    if (typeof message === 'string') {
      message = new Error(message);
    } else if (!message) {
      message = new Error('Assertion failed');
    }

    throw message;
  }
}

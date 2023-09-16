/**
 * The `delay` function returns a promise that resolves after a specified amount of time.
 * @param {number} timeMs - The `timeMs` parameter is the time in milliseconds for which the delay
 * should occur. It specifies the amount of time the function should wait before resolving the promise
 * and continuing with the execution.
 * @returns The `delay` function is returning a `Promise<void>`.
 */
export function delay(timeMs: number) {
  return new Promise<void>((resolve) =>
    setTimeout(() => {
      resolve();
    }, timeMs)
  );
}

export function castError(error: unknown): Error {
  return error as Error;
}

export function isMsOrSeconds(epoch: number) {
  const date = new Date(epoch);

  if (
    Math.abs(Date.now() - date.valueOf()) <
    Math.abs(Date.now() - date.valueOf() * 1000)
  ) {
    return 'ms';
  } else {
    return 'seconds';
  }
}

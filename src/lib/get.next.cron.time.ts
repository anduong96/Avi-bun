import CronParser from 'cron-parser';

import { MaybeNil } from '@app/types/maybe.nil';

/**
 * The function `getNextCronTime` takes a cron time expression as input and returns the next occurrence
 * of that cron time as a Date object.
 * @param {string} cronTime - The `cronTime` parameter is a string that represents a cron expression. A
 * cron expression is a string consisting of five or six fields separated by spaces. Each field
 * represents a specific unit of time, such as minutes, hours, days, etc., and is defined by a set of
 * values or a
 * @returns the next occurrence of the cron time as a JavaScript Date object.
 */
export function getNextCronTime(cronTime: MaybeNil<string>) {
  if (!cronTime) {
    return null;
  }

  return CronParser.parseExpression(cronTime).next().toDate();
}

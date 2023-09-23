import moment from 'moment';

/**
 * The function converts a moment input to a Date object or returns null if the input is falsy.
 * @param date - The `date` parameter is of type `moment.MomentInput`, which means it can accept
 * various types of inputs that can be parsed into a `moment` object. This can include a `moment`
 * object itself, a string in a recognized date format, a JavaScript `Date` object, or
 * @returns a Date object if the input date is not null, otherwise it returns null.
 */
export function toDateOrNull(date: moment.MomentInput) {
  return date ? moment(date).toDate() : null;
}

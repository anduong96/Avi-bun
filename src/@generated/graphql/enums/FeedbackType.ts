import { registerEnumType } from 'type-graphql';

export enum GQL_FeedbackType {
  FEATURE_REQUEST = 'FEATURE_REQUEST',
  APP_ENHANCEMENT = 'APP_ENHANCEMENT',
  BUG_REPORT = 'BUG_REPORT',
  INQUIRY = 'INQUIRY',
  QUESTION = 'QUESTION',
}
registerEnumType(GQL_FeedbackType, {
  name: 'FeedbackType',
});

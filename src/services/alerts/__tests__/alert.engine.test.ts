import { beforeEach, describe, it, mock } from 'bun:test';

const mockSendToTopic = mock(() => {
  return {
    messageId: 1,
  };
});

mock.module('../../../firebase.ts', () => ({
  firebase: {
    messaging: () => ({
      sendToTopic: mockSendToTopic,
    }),
  },
}));

describe('services::alerts::alert.engine', () => {
  beforeEach(() => {
    mockSendToTopic.mockReset();
  });

  it.todo('handleFlightChangesForAlerts', async () => {});
});

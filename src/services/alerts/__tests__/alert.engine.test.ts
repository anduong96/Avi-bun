import { describe, it, mock } from 'bun:test';

const mockSendToTopic = () => {
  return {
    messageId: 1,
  };
};

mock.module('../../../firebase.ts', () => ({
  firebase: {
    messaging: () => ({
      sendToTopic: mockSendToTopic,
    }),
  },
}));

describe('services::alerts::alert.engine', () => {
  it.todo('handleFlightChangesForAlerts', async () => {
    // handleFlightChangesForAlert({
    //   destination: '1',
    //   destinationGate: '1',
    //   destinationTerminal: '1',
    //   estimatedGateArrival: new Date(),
    //   estimatedGateDeparture: new Date(),
    //   id: '1',
    //   origin: '1',
    //   originGate: '1',
    //   originTerminal: '1',
    //   scheduledGateArrival: new Date(),
    //   scheduledGateDeparture: new Date(),
    // });
  });
});

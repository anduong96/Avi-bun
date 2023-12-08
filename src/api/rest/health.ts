import Elysia from 'elysia';

export default new Elysia().get('/health', () => {
  return 'OK';
});

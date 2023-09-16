declare module 'gitops-secrets' {
  export const loadSecrets: () => unknown;

  async function fetchFromDoppler({
    dopplerToken: string,
  }): Promise<Record<string, string>>;

  export const providers = {
    doppler: {
      fetch: fetchFromDoppler,
    },
  };
}

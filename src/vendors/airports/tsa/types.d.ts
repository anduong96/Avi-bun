export type TSA_Result<T> = T & {
  airport_code: string;
  airport_name: string;
};

export type TSA_WaitTimeEntry = {
  day: string;
  hour: string;
  max_standard_wait: string;
  updated: string;
};

export type TSA_WaitTimeResult = TSA_Result<{
  count: number;
  data: TSA_WaitTimeEntry[];
}>;

export type TSA_CheckpointResult = TSA_Result<{
  day_of_week: string;
  terminals: {
    [Terminal: string]: {
      checkpoints: {
        [Checkpoint: string]: {
          checkpoint_name: string;
          hours: {
            [hour: string]: 'close' | 'open';
          };
        };
      };
      terminal_name: string;
    };
  };
}>;

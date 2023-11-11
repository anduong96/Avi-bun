export type TSA_WaitTimeEntry = {
  day: string;
  hour: string;
  max_standard_wait: string;
  updated: string;
};

export type TSA_WaitTimeResult = {
  airport_code: string;
  airport_name: string;
  count: number;
  data: TSA_WaitTimeEntry[];
};

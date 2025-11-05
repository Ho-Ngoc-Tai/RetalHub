/* eslint-disable @typescript-eslint/no-explicit-any */
export type MetaType = {
  [key: string]: any;
  total?: number;
};
export type ParamType = {
  [key: string]: any;
  page?: number;
  limit?: number;
};

export type StateType = {
  isCalling?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  data?: any[] | any;
  params?: ParamType | null;
  meta?: MetaType | null;
};

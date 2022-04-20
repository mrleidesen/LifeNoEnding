export interface TLimit {
  min: number;
  max: number;
}

export type ResponseInfo<T> = {
  success: boolean;
  data?: T;
};

import type { TLimit } from '.';

export interface TRest {
  exp: TLimit;
  hp: number;
  timeout: number;
}

export interface THospital {
  id: number;
  gold: number;
  hp: number;
  timeout: number;
}

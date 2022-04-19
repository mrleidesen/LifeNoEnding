import type { TLimit } from '.';

export interface TTimeLimit {
  start: string | number | Date;
  end: string | number | Date;
}

export interface TWork {
  id: number;
  name: string;
  gold: TLimit;
  damage: TLimit;
  exp: TLimit;
  time: TTimeLimit;
  limit: number;
}

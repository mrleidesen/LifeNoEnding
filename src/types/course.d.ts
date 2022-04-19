import type { TLimit } from '.';

export interface TCourse {
  id: number;
  name: string;
  damage: TLimit;
  exp: TLimit;
  limit: number;
  timeout: number;
}

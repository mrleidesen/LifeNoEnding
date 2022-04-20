import type { ResponseInfo } from '@/types';
import type { TWork } from '@/types/work';

import service from '.';

type WorkInfoResponse = ResponseInfo<{
  exp: number;
  damage: number;
  gold: number;
}>;

export const getWorkList = () => {
  return service.get<TWork[], TWork[]>('/works');
};

export const getWorkInfo = (id: number) => {
  return service.post<WorkInfoResponse, WorkInfoResponse>('/work/info', {
    id,
  });
};

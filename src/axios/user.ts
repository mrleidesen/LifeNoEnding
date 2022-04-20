import type { ResponseInfo } from '@/types';
import type { TUser } from '@/types/user';

import service from '.';

type UserRestResponse = ResponseInfo<{
  hp: number;
}>;

export const putUser = (user: Partial<TUser>) => {
  return service.put('/user', user);
};

export const getUser = () => {
  return service.get<TUser, TUser>('/user');
};

export const getUserRest = () => {
  return service.post<UserRestResponse, UserRestResponse>('/user/rest');
};

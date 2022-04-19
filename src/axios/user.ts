import type { TUser } from '@/types/user';

import service from '.';

export const putUser = (user: Partial<TUser>) => {
  return service.put('/user', user);
};

export const getUser = () => {
  return service.get<TUser, TUser>('/user');
};

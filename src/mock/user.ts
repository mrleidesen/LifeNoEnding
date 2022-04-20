import type { TUser } from '@/types/user';

import Mock from 'mockjs';

import { MAX_HP, SAVE_USER_KEY } from '@/constance';

const localUser = localStorage.getItem(SAVE_USER_KEY);

export const user: TUser = localUser
  ? JSON.parse(localUser)
  : {
      name: '卷仔',
      exp: 0,
      hp: MAX_HP,
      gold: 0,
    };

export const updateUser = (updateUser: Partial<TUser>) => {
  const newValue = {
    name: updateUser?.name ?? user.name,
    exp: updateUser?.exp ?? user.exp,
    hp: Math.min(updateUser?.hp ?? user.hp, MAX_HP),
    gold: updateUser?.gold ?? user.gold,
  };

  Object.assign(user, newValue);
};

Mock.mock('/api/user', 'get', () => {
  return user;
});

Mock.mock('/api/user', 'put', (options: { body?: string }) => {
  const data = JSON.parse(options?.body ?? '{}');
  updateUser(data);

  return {
    success: true,
  };
});

Mock.mock('/api/user/rest', 'post', () => {
  if (user.hp >= MAX_HP) {
    return {
      success: false,
    };
  }
  const getHP = Mock.Random.integer(1, 5);

  updateUser({
    hp: user.hp + getHP,
  });

  return {
    success: true,
    data: {
      hp: getHP,
    },
  };
});

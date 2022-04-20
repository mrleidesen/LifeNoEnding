import type { TWork } from '@/types/work';

import dayjs from 'dayjs';
import Mock from 'mockjs';

import { updateUser, user } from './user';

const Random = Mock.Random;

const workList: TWork[] = [
  {
    id: 1,
    name: '搬砖',
    exp: {
      min: 10,
      max: 20,
    },
    damage: {
      min: 2,
      max: 4,
    },
    gold: {
      min: 10,
      max: 50,
    },
    time: {
      start: dayjs().format('YYYY/MM/DD 09:00:00'),
      end: dayjs().format('YYYY/MM/DD 21:00:00'),
    },
    limit: 100,
    timeout: 10,
  },
  {
    id: 2,
    name: 'CRUD',
    exp: {
      min: 10,
      max: 20,
    },
    damage: {
      min: 4,
      max: 6,
    },
    gold: {
      min: 50,
      max: 70,
    },
    time: {
      start: dayjs().format('YYYY/MM/DD 09:00:00'),
      end: dayjs().format('YYYY/MM/DD 19:00:00'),
    },
    limit: 500,
    timeout: 10,
  },
  {
    id: 3,
    name: '开源作者',
    exp: {
      min: 20,
      max: 40,
    },
    damage: {
      min: 4,
      max: 8,
    },
    gold: {
      min: 0,
      max: 500,
    },
    time: {
      start: dayjs().format('YYYY/MM/DD 10:00:00'),
      end: dayjs().format('YYYY/MM/DD 18:00:00'),
    },
    limit: 2000,
    timeout: 10,
  },
  {
    id: 4,
    name: '创业',
    exp: {
      min: 0,
      max: 100,
    },
    damage: {
      min: 0,
      max: 15,
    },
    gold: {
      min: -100,
      max: 1000,
    },
    time: {
      start: dayjs().format('YYYY/MM/DD 05:00:00'),
      end: dayjs().format('YYYY/MM/DD 23:00:00'),
    },
    limit: 5000,
    timeout: 10,
  },
];

Mock.mock('/api/works', 'get', () => {
  return workList;
});

Mock.mock('/api/work/info', 'post', (options: { body?: string }) => {
  const data = JSON.parse(options?.body ?? '{}');
  const work = workList.find((item) => item.id === data.id);

  if (work) {
    const exp = Random.integer(work.exp.min, work.exp.max);
    const damage = Random.integer(work.damage.min, work.damage.max);
    const gold = Random.integer(work.gold.min, work.gold.max);

    updateUser({
      exp: user.exp + exp,
      hp: user.hp - damage,
      gold: user.gold + gold,
    });

    return {
      success: true,
      data: {
        exp,
        damage,
        gold,
      },
    };
  }

  return {
    success: false,
  };
});

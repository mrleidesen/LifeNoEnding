import type { TWork } from '@/types/work';

import dayjs from 'dayjs';
import Mock from 'mockjs';

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
      max: 20,
    },
    time: {
      start: dayjs().format('YYYY/MM/DD 09:00:00'),
      end: dayjs().format('YYYY/MM/DD 21:00:00'),
    },
    limit: 100,
  },
];

Mock.mock('/api/works', 'get', () => {
  return workList;
});

Mock.mock('/api/work/info', 'post', (options: { body?: string }) => {
  const data = JSON.parse(options?.body ?? '{}');
  const work = workList.find((item) => item.id === data.id);

  if (work) {
    return {
      success: true,
      data: {
        exp: Random.integer(work.exp.min, work.exp.max),
        damage: Random.integer(work.damage.min, work.damage.max),
        gold: Random.integer(work.gold.min, work.gold.max),
      },
    };
  }

  return {
    success: false,
  };
});

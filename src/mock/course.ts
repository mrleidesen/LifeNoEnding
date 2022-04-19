import type { TCourse } from '@/types/course';

import Mock from 'mockjs';

import { updateUser, user } from './user';

const Random = Mock.Random;

const courseList: TCourse[] = [
  {
    id: 1,
    name: '程序员入门指南',
    exp: {
      min: 0,
      max: 5,
    },
    damage: {
      min: 0,
      max: 1,
    },
    limit: 0,
    timeout: 5,
  },
];

Mock.mock('/api/course', 'get', () => {
  return courseList;
});

Mock.mock('/api/course/info', 'post', (options: { body?: string }) => {
  const data = JSON.parse(options?.body ?? '{}');
  const course = courseList.find((item) => item.id === data.id);

  if (course) {
    const exp = Random.integer(course.exp.min, course.exp.max);
    const damage = Random.integer(course.damage.min, course.damage.max);

    updateUser({
      exp: user.exp + exp,
      hp: user.hp - damage,
    });

    return {
      success: true,
      data: {
        exp,
        damage,
      },
    };
  }

  return {
    success: false,
  };
});

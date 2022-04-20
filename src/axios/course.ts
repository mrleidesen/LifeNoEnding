import type { ResponseInfo } from '@/types';
import type { TCourse } from '@/types/course';

import service from '.';

type CourseInfoResponse = ResponseInfo<{
  exp: number;
  damage: number;
}>;

export const getCourseList = () => {
  return service.get<TCourse[], TCourse[]>('/course');
};

export const getCourseInfo = (id: number) => {
  return service.post<CourseInfoResponse, CourseInfoResponse>('/course/info', {
    id,
  });
};

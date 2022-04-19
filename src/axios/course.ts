import type { TCourse } from '@/types/course';

import service from '.';

type CourseInfoResponse = {
  success: boolean;
  data?: {
    exp: number;
    damage: number;
  };
};

export const getCourseList = () => {
  return service.get<TCourse[], TCourse[]>('/course');
};

export const getCourseInfo = (id: number) => {
  return service.post<CourseInfoResponse, CourseInfoResponse>('/course/info', {
    id,
  });
};

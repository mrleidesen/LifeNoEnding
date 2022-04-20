import type { TEmployee, TUser } from '@/types';

import axios from 'axios';

type ResponseInfo<T> = {
  success?: boolean;
  data?: T;
  message?: string;
};

const service = axios.create({
  baseURL: '/api',
});

service.interceptors.response.use((resp) => {
  return resp.data;
});

export const getUserInfo = () => {
  return service.get<TUser, TUser>('/user');
};

export const updateUserInfo = (user: Partial<TUser>) => {
  return service.post<ResponseInfo<any>, ResponseInfo<any>>('/user', user);
};

export const getEmployeeList = () => {
  return service.get<TEmployee[], TEmployee[]>('/employee/list');
};

export const getUserEmployeeList = () => {
  return service.get<TEmployee[], TEmployee[]>('/employee/user');
};

export const getSingleEmployee = (id: number) => {
  return service.post<ResponseInfo<any>, ResponseInfo<any>>(`/employee/get`, {
    id,
  });
};

export const reloadEmployeeSave = (list: TEmployee[]) => {
  return service.post<ResponseInfo<any>, ResponseInfo<any>>(`/employee/save`, {
    list,
  });
};

export const employeeWork = (id: number) => {
  return service.post<ResponseInfo<any>, ResponseInfo<any>>(`/employee/work`, {
    id,
  });
};

export const employeeRest = (id: number) => {
  return service.post<ResponseInfo<any>, ResponseInfo<any>>(`/employee/rest`, {
    id,
  });
};

export const employeeHospital = (id: number) => {
  return service.post<ResponseInfo<any>, ResponseInfo<any>>(
    `/employee/hospital`,
    {
      id,
    }
  );
};

export default service;

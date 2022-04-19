import axios from 'axios';

const service = axios.create({
  baseURL: '/api',
});

service.interceptors.response.use((resp) => {
  return resp.data;
});

export default service;

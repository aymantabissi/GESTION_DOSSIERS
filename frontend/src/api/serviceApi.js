import axiosInstance from '../utils/axiosInstance';

const SERVICE_URL = '/services';

export const getServices = async () => {
  return axiosInstance.get(SERVICE_URL).then(res => res.data);
};

export const getServiceById = async (id) => {
  return axiosInstance.get(`${SERVICE_URL}/${id}`).then(res => res.data);
};

export const createService = async (service) => {
  return axiosInstance.post(SERVICE_URL, service).then(res => res.data);
};

export const updateService = async (id, service) => {
  return axiosInstance.put(`${SERVICE_URL}/${id}`, service).then(res => res.data);
};

export const deleteService = async (id) => {
  return axiosInstance.delete(`${SERVICE_URL}/${id}`).then(res => res.data);
};

import axiosInstance from '../utils/axiosInstance';

const DIVISION_URL = '/divisions';

export const getDivisions = async () => {
  return axiosInstance.get(DIVISION_URL).then(res => res.data);
};

export const createDivision = async (division) => {
  return axiosInstance.post(DIVISION_URL, division).then(res => res.data);
};

export const updateDivision = async (id, division) => {
  return axiosInstance.put(`${DIVISION_URL}/${id}`, division).then(res => res.data);
};

export const deleteDivision = async (id) => {
  return axiosInstance.delete(`${DIVISION_URL}/${id}`).then(res => res.data);
};

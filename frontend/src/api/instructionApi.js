import axiosInstance from '../utils/axiosInstance';

const INSTRUCTION_URL = '/instructions';

export const getInstructions = async () => {
  return axiosInstance.get(INSTRUCTION_URL).then(res => res.data);
};

export const createInstruction = async (instruction) => {
  return axiosInstance.post(INSTRUCTION_URL, instruction).then(res => res.data);
};

export const updateInstruction = async (id, instruction) => {
  return axiosInstance.put(`${INSTRUCTION_URL}/${id}`, instruction).then(res => res.data);
};

export const deleteInstruction = async (id) => {
  return axiosInstance.delete(`${INSTRUCTION_URL}/${id}`).then(res => res.data);
};

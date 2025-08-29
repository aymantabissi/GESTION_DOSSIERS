import axios from 'axios';

const API_URL = 'http://localhost:5000/api/instructions'; // ✅ path صحيح

// جلب التوكن من localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    }
  };
};

// GET all instructions
export const getInstructions = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Erreur fetch instructions:', error);
    throw error;
  }
};

// POST create instruction
export const createInstruction = async (instruction) => {
  const response = await axios.post(API_URL, instruction, getAuthHeaders());
  return response.data;
};

// PUT update instruction
export const updateInstruction = async (id, instruction) => {
  const response = await axios.put(`${API_URL}/${id}`, instruction, getAuthHeaders());
  return response.data;
};

// DELETE instruction
export const deleteInstruction = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};

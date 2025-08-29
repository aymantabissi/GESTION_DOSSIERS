import axios from 'axios';
import API_BASE_URL from '../config/api';
const API_URL = `${API_BASE_URL}/api/divisions`;
// جلب التوكن من localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // ولا اسم key اللي كتستعمل
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    }
  };
};

export const getDivisions = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Erreur fetch divisions:', error);
    throw error;
  }
};

export const createDivision = async (division) => {
  const response = await axios.post(API_URL, division, getAuthHeaders());
  return response.data;
};

export const updateDivision = async (id, division) => {
  const response = await axios.put(`${API_URL}/${id}`, division, getAuthHeaders());
  return response.data;
};

export const deleteDivision = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};

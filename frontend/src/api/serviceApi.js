import axios from 'axios';

const API_URL = 'http://localhost:5000/api/services'; // endpoint service

// جلب التوكن من localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // ولا اسم key اللي كتستعمل
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    }
  };
};

// 🔹 Get all services
export const getServices = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Erreur fetch services:', error);
    throw error;
  }
};

// 🔹 Get service by ID
export const getServiceById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Erreur fetch service:', error);
    throw error;
  }
};

// 🔹 Create service
export const createService = async (service) => {
  try {
    const response = await axios.post(API_URL, service, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Erreur create service:', error);
    throw error;
  }
};

// 🔹 Update service
export const updateService = async (id, service) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, service, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Erreur update service:', error);
    throw error;
  }
};

// 🔹 Delete service
export const deleteService = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Erreur delete service:', error);
    throw error;
  }
};

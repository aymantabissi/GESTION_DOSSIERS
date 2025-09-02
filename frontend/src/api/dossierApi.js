import axiosInstance from '../utils/axiosInstance';

const API_URL = '/dossiers';
const DIVISION_URL = '/divisions';
const SERVICE_URL = '/services';

// Get Dossiers with better error handling
export const getDossiers = async ({ page = 1, limit = 100, search = '', status } = {}) => {
  try {
    const params = { page, limit };
    
    // Only add search if it's not empty
    if (search && search.trim()) {
      params.search = search.trim();
    }
    
    // Only add status if it's not 'all' or undefined
    if (status && status !== 'all') {
      params.status = status;
    }
    
    console.log('📡 getDossiers params:', params);
    
    const res = await axiosInstance.get(API_URL, { params });
    
    console.log('✅ getDossiers response:', res.data);
    
    return res.data || { total: 0, dossiers: [], page: 1, totalPages: 1 };
  } catch (err) {
    console.error('❌ Erreur getDossiers:', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
      url: err.config?.url
    });
    
    // Return empty data structure instead of throwing
    return { total: 0, dossiers: [], page: 1, totalPages: 1, error: err.message };
  }
};

export const createDossier = async (dossier) => {
  try {
    const res = await axiosInstance.post(API_URL, dossier);
    return res.data;
  } catch (err) {
    console.error('❌ Erreur createDossier:', err);
    throw err;
  }
};

export const updateDossier = async (id, dossier) => {
  try {
    const res = await axiosInstance.put(`${API_URL}/${id}`, dossier);
    return res.data;
  } catch (err) {
    console.error('❌ Erreur updateDossier:', err);
    throw err;
  }
};

export const deleteDossier = async (id) => {
  try {
    const res = await axiosInstance.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error('❌ Erreur deleteDossier:', err);
    throw err;
  }
};

// Get Divisions
export const getDivisions = async () => {
  try {
    const res = await axiosInstance.get(DIVISION_URL);
    return res.data;
  } catch (err) {
    console.error('❌ Erreur getDivisions:', err);
    throw err;
  }
};

// Get Services
export const getServices = async () => {
  try {
    const res = await axiosInstance.get(SERVICE_URL);
    return res.data;
  } catch (err) {
    console.error('❌ Erreur getServices:', err);
    throw err;
  }
};

// Get Suivi Dossier
export const getSuiviDossier = async (id) => {
  try {
    const res = await axiosInstance.get(`${API_URL}/${id}/suivi`);
    return res.data;
  } catch (err) {
    console.error('❌ Erreur getSuiviDossier:', err);
    throw err;
  }
};

// Add Instruction to Dossier
export const addInstructionToDossier = async (num_dossier, id_instruction) => {
  try {
    const res = await axiosInstance.post(`${API_URL}/add-instruction`, { 
      num_dossier, 
      id_instruction 
    });
    return res.data;
  } catch (err) {
    console.error('❌ Erreur addInstructionToDossier:', err);
    throw err;
  }
};

// Get Etat Dossier
export const getEtatDossier = async (num_dossier) => {
  try {
    const res = await axiosInstance.get(`/situations/${num_dossier}/etat`);
    return res.data;
  } catch (err) {
    console.error('❌ Erreur getEtatDossier:', err);
    throw err;
  }
};

// Change Etat Dossier
export const changeEtatDossier = async (num_dossier, nouveau_etat, observation = '') => {
  try {
    const res = await axiosInstance.post(`/situations/${num_dossier}/change-etat`, { 
      nouveau_etat, 
      observation 
    });
    return res.data;
  } catch (err) {
    console.error('❌ Erreur changeEtatDossier:', err);
    throw err;
  }
};
import axiosInstance from '../utils/axiosInstance';

const API_URL = '/dossiers';
const DIVISION_URL = '/divisions';
const SERVICE_URL = '/services';

// 📌 Dossiers
export const getDossiers = async ({ page = 1, limit = 100, search = '' } = {}) => {
  try {
    const res = await axiosInstance.get('/dossiers', { params: { page, limit, search } });
    // API ديالك دابا خصها ترجع object فيه:
    // { total: عدد الدossiers كاملين, dossiers: array ديال الدossiers فالصفحة الحالية }
    return res.data || { total: 0, dossiers: [] };
  } catch (err) {
    console.error('Erreur getDossiers:', err);
    return { total: 0, dossiers: [] };
  }
};


export const createDossier = async (dossier) => {
  return axiosInstance.post(API_URL, dossier).then(res => res.data);
};

export const updateDossier = async (id, dossier) => {
  return axiosInstance.put(`${API_URL}/${id}`, dossier).then(res => res.data);
};

export const deleteDossier = async (id) => {
  return axiosInstance.delete(`${API_URL}/${id}`).then(res => res.data);
};

// 📌 Divisions
export const getDivisions = async () => {
  return axiosInstance.get(DIVISION_URL).then(res => res.data);
};

// 📌 Services
export const getServices = async () => {
  return axiosInstance.get(SERVICE_URL).then(res => res.data);
};
export const getSuiviDossier = async (id) => {
  return axiosInstance.get(`${API_URL}/${id}/suivi`).then(res => res.data);
};
export const addInstructionToDossier = async (num_dossier, id_instruction) => {
  return axiosInstance.post('/dossiers/add-instruction', { 
    num_dossier, 
    id_instruction 
  });
};
export const getEtatDossier = async (num_dossier) => {
  return axiosInstance.get(`/situations/${num_dossier}/etat`).then(res => res.data);
};

export const changeEtatDossier = async (num_dossier, nouveau_etat, observation = '') => {
  return axiosInstance.post(`/situations/${num_dossier}/change-etat`, { 
    nouveau_etat, 
    observation 
  }).then(res => res.data);
};

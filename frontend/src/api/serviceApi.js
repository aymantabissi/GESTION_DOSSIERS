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

// ===== Export PDF =====
export const exportServicesPDF = async () => {
  try {
    const response = await axiosInstance.get(`${SERVICE_URL}/export/pdf`, {
      responseType: 'blob', // important pour fichiers binaires
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'services.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Erreur export PDF:', error);
    throw error;
  }
};

// ===== Export CSV =====
export const exportServicesCSV = async () => {
  try {
    const response = await axiosInstance.get(`${SERVICE_URL}/export/csv`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'services.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Erreur export CSV:', error);
    throw error;
  }
};

import axiosInstance from '../utils/axiosInstance';

const DIVISION_URL = '/divisions';

// Basic CRUD operations
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

// Export functions
export const exportDivisionsPDF = async () => {
  try {
    const response = await axiosInstance.get(`${DIVISION_URL}/export/pdf`, {
      responseType: 'blob',
      timeout: 30000, // 30 seconds timeout
    });

    // Create blob and download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `divisions_${new Date().toISOString().split('T')[0]}.pdf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
    
    return { success: true, message: 'PDF exporté avec succès' };
  } catch (error) {
    console.error('Export PDF error:', error);
    throw new Error(
      error.response?.status === 403 
        ? 'Permission refusée pour l\'export' 
        : error.response?.status === 404
        ? 'Aucune donnée à exporter'
        : 'Erreur lors de l\'export PDF'
    );
  }
};


export const exportDivisionsCSV = async () => {
  try {
    const response = await axiosInstance.get(`${DIVISION_URL}/export/csv`, {
      responseType: 'blob',
      timeout: 30000,
    });

    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `divisions_${new Date().toISOString().split('T')[0]}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);

    return { success: true, message: 'CSV exporté avec succès' };
  } catch (error) {
    console.error('Export CSV error:', error);
    throw new Error(
      error.response?.status === 403
        ? 'Permission refusée pour l\'export'
        : error.response?.status === 404
        ? 'Aucune donnée à exporter'
        : 'Erreur lors de l\'export CSV'
    );
  }
};

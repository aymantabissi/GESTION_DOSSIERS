import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { getDossiers, deleteDossier, changeEtatDossier } from '../api/dossierApi';

export const useDossierList = (pageSize = 8) => {
  const [dossiers, setDossiers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Use refs to track the current values without triggering re-renders
  const currentSearchTerm = useRef(searchTerm);
  const currentFilterStatus = useRef(filterStatus);
  const currentSortConfig = useRef(sortConfig);

  // Update refs when state changes
  useEffect(() => {
    currentSearchTerm.current = searchTerm;
  }, [searchTerm]);

  useEffect(() => {
    currentFilterStatus.current = filterStatus;
  }, [filterStatus]);

  useEffect(() => {
    currentSortConfig.current = sortConfig;
  }, [sortConfig]);

  // Single fetch function that handles all scenarios
  const fetchDossiers = useCallback(async (page = null, resetPage = false) => {
    const fetchPage = resetPage ? 1 : (page ?? currentPage);
    
    setLoading(true);
    try {
      const params = { 
        page: fetchPage, 
        limit: pageSize,
        search: currentSearchTerm.current,
        status: currentFilterStatus.current !== 'all' ? currentFilterStatus.current : undefined
      };
      
      const { dossiers: data = [], total = 0, totalPages: serverTotalPages = 1 } = await getDossiers(params);
      
      setDossiers(data);
      setTotalItems(total);
      setTotalPages(serverTotalPages || Math.ceil(total / pageSize));
      
      // Update current page if it was reset
      if (resetPage && currentPage !== 1) {
        setCurrentPage(1);
      } else if (page && page !== currentPage) {
        setCurrentPage(fetchPage);
      }
      
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors du chargement des dossiers');
      setDossiers([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  // Handle search changes
  const handleSearchChange = useCallback((newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    // Fetch with reset page
    setTimeout(() => {
      fetchDossiers(1, true);
    }, 300); // Debounce search
  }, [fetchDossiers]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilterStatus) => {
    setFilterStatus(newFilterStatus);
    fetchDossiers(1, true);
  }, [fetchDossiers]);

  // Handle sort changes
  const handleSort = useCallback((key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    fetchDossiers(1, true);
  }, [sortConfig, fetchDossiers]);

  // Handle page changes - this should only be called by pagination component
  const handlePageChange = useCallback((page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSelected([]); // Clear selections when changing pages
      fetchDossiers(page);
    }
  }, [currentPage, totalPages, fetchDossiers]);

  // Delete single dossier
  const handleDelete = async (id) => {
    try {
      await deleteDossier(id);
      
      // Check if current page will be empty after deletion
      const remainingItems = totalItems - 1;
      const newTotalPages = Math.ceil(remainingItems / pageSize);
      
      if (currentPage > newTotalPages && newTotalPages > 0) {
        fetchDossiers(newTotalPages);
      } else {
        fetchDossiers(currentPage);
      }
      
      toast.success('Dossier supprimé avec succès !');
      return true;
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la suppression du dossier');
      return false;
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selected.length === 0) return false;
    
    try {
      await Promise.all(selected.map(id => deleteDossier(id)));
      
      // Calculate new page after bulk deletion
      const remainingItems = totalItems - selected.length;
      const newTotalPages = Math.ceil(remainingItems / pageSize);
      
      if (currentPage > newTotalPages && newTotalPages > 0) {
        fetchDossiers(newTotalPages);
      } else {
        fetchDossiers(currentPage);
      }
      
      toast.success(`${selected.length} dossier(s) supprimé(s) avec succès !`);
      setSelected([]);
      return true;
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la suppression des dossiers');
      return false;
    }
  };

  // Change state
  const handleChangeEtat = async (dossier, nouveauEtat) => {
    try {
      const observation = prompt("Observation (optionnel) :") || '';
      await changeEtatDossier(dossier.num_dossier, nouveauEtat, observation);
      toast.success(`État mis à jour : ${nouveauEtat}`);
      await fetchDossiers(currentPage);
      return true;
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors du changement');
      return false;
    }
  };

  // Selection handlers
  const handleSelectAll = useCallback(() => {
    setSelected(prev => {
      const currentIds = dossiers.map(d => d.num_dossier);
      const allSelected = prev.length === currentIds.length && currentIds.length > 0;
      return allSelected ? [] : currentIds;
    });
  }, [dossiers]);

  const handleSelect = useCallback((id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setFilterStatus('all');
    fetchDossiers(1, true);
  }, [fetchDossiers]);

  // Manual refresh function
  const handleRefresh = useCallback(() => {
    fetchDossiers(currentPage);
  }, [fetchDossiers, currentPage]);

  // Initial fetch - only run once on mount
  useEffect(() => {
    fetchDossiers(1);
  }, []); // Empty dependency array - only runs once

  return {
    dossiers,
    currentDossiers: dossiers,
    filteredDossiers: dossiers,
    currentPage,
    selected,
    searchTerm,
    filterStatus,
    loading,
    totalPages,
    totalItems,
    setCurrentPage: handlePageChange,
    setSearchTerm: handleSearchChange,
    setFilterStatus: handleFilterChange,
    fetchDossiers: handleRefresh,
    handleSort,
    handleDelete,
    handleBulkDelete,
    handleChangeEtat,
    handleSelectAll,
    handleSelect,
    handleResetFilters
  };
};
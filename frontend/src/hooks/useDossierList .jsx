import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getDossiers, deleteDossier, changeEtatDossier } from '../api/dossierApi';
import { useDebounce } from './useDebounce';

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

  // Debounced search
  const debouncedSearch = useDebounce(searchTerm, 400);

  // Fetch dossiers
  const fetchDossiers = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: pageSize,
          search: debouncedSearch,
          status: filterStatus !== 'all' ? filterStatus : undefined,
          sortKey: sortConfig.key || undefined,
          sortDirection: sortConfig.key ? sortConfig.direction : undefined,
        };

        const { dossiers: data = [], total = 0, totalPages: serverTotalPages = 1 } =
          await getDossiers(params);

        setDossiers(data);
        setTotalItems(total);
        setTotalPages(serverTotalPages || Math.ceil(total / pageSize));
        setCurrentPage(page);
      } catch (err) {
        console.error(err);
        toast.error('Erreur lors du chargement des dossiers');
        setDossiers([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, filterStatus, sortConfig, pageSize]
  );

  // Refresh dossiers when search/filter/sort changes
  useEffect(() => {
    fetchDossiers(1);
  }, [debouncedSearch, filterStatus, sortConfig, fetchDossiers]);

  // Handle search changes
  const handleSearchChange = useCallback((newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilterStatus) => {
    setFilterStatus(newFilterStatus);
  }, []);

  // Handle sort changes
  const handleSort = useCallback(
    (key) => {
      let direction = 'ascending';
      if (sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
      }
      setSortConfig({ key, direction });
    },
    [sortConfig]
  );

  // Handle page changes
  const handlePageChange = useCallback(
    (page) => {
      if (page !== currentPage && page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        setSelected([]); // Clear selections when changing pages
        fetchDossiers(page);
      }
    },
    [currentPage, totalPages, fetchDossiers]
  );

  // Delete single dossier
  const handleDelete = async (id) => {
    try {
      await deleteDossier(id);

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
      await Promise.all(selected.map((id) => deleteDossier(id)));

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
      const observation = prompt('Observation (optionnel) :') || '';
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
    setSelected((prev) => {
      const currentIds = dossiers.map((d) => d.num_dossier);
      const allSelected = prev.length === currentIds.length && currentIds.length > 0;
      return allSelected ? [] : currentIds;
    });
  }, [dossiers]);

  const handleSelect = useCallback((id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setFilterStatus('all');
    setSortConfig({ key: null, direction: 'ascending' });
    fetchDossiers(1);
  }, [fetchDossiers]);

  // Manual refresh
  const handleRefresh = useCallback(() => {
    fetchDossiers(currentPage);
  }, [fetchDossiers, currentPage]);

  // Initial fetch
  useEffect(() => {
    fetchDossiers(1);
  }, []); // only once on mount

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
    handleResetFilters,
  };
};

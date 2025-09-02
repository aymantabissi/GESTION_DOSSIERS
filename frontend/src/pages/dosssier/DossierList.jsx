import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ConfirmModal from '../../compenents/ConfirmModal';

import { useDossierList } from '../../hooks/useDossierList ';
import DossierHeader from './DossierHeader';
import DossierTable from './DossierTable';
import SearchFilterBar from './SearchFilterBar ';
import DossierPagination from './DossierPagination ';

const DossierList = ({ onEdit, onAdd, darkMode }) => {
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const {
    filteredDossiers,
    currentDossiers,
    currentPage,
    selected,
    searchTerm,
    filterStatus,
    loading,
    totalPages,
    totalItems,
    setCurrentPage,
    setSearchTerm,
    setFilterStatus,
    fetchDossiers, // This is now the refresh function
    handleSort,
    handleDelete,
    handleBulkDelete,
    handleChangeEtat,
    handleSelectAll,
    handleSelect,
    handleResetFilters
  } = useDossierList();

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    const success = await handleDelete(deleteId);
    if (success) {
      setShowModal(false);
      setDeleteId(null);
    }
  };

  const handleEditClick = (dossier) => {
    onEdit(dossier);
    toast.info('Dossier prêt à être modifié');
  };

  const containerBg = darkMode ? '#121212' : '#f8f9fa';
  const cardBg = darkMode ? '#1f1f1f' : '#fff';
  const textColor = darkMode ? '#fff' : '#000';

  return (
    <div style={{ backgroundColor: containerBg, minHeight: '100vh', paddingTop: '20px', color: textColor }}>
      <Card className="shadow-sm border-0 mb-4" style={{ backgroundColor: cardBg, color: textColor }}>
        <DossierHeader
          filteredDossiersCount={totalItems}
          selectedCount={selected.length}
          onAdd={onAdd}
          onBulkDelete={handleBulkDelete}
          onRefresh={fetchDossiers} 
          darkMode={darkMode}
        />

        <Card.Body className="p-4">
         <SearchFilterBar
  searchTerm={searchTerm}
  onSearchChange={value => setSearchTerm(value)}   // ✅ هنا كيعيط handleSearchChange
  filterStatus={filterStatus}
  onFilterChange={value => setFilterStatus(value)} // ✅ هنا كيعيط handleFilterChange
  onReset={handleResetFilters}
  darkMode={darkMode}
/>


          <DossierTable
            dossiers={currentDossiers}
            selected={selected}
            loading={loading}
            darkMode={darkMode}
            onSelectAll={() => handleSelectAll(currentDossiers)}
            onSelect={handleSelect}
            onEdit={handleEditClick}
            onDelete={confirmDelete}
            onChangeEtat={handleChangeEtat}
            onSort={handleSort}
          />
        </Card.Body>

        {!loading && totalItems > 0 && (
          <DossierPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage} 
            totalItems={totalItems}
            selectedCount={selected.length}
            darkMode={darkMode}
          />
        )}
      </Card>

      <ConfirmModal
        show={showModal}
        title="Supprimer le Dossier"
        message="Êtes-vous sûr de vouloir supprimer ce dossier ? Cette action est irréversible."
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
};

export default DossierList;
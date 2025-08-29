// src/pages/division/DivisionPage.jsx
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Spinner } from "react-bootstrap";
import { createDivision, updateDivision, deleteDivision } from "../../api/divisionApi";
import { getDivisions } from "../../api/dossierApi";
import { toast } from "react-toastify";
import ConfirmModal from "../../compenents/ConfirmModal";
import { useTranslation } from "react-i18next";
import PaginationComponent from "../../compenents/PaginationComponent";

const DivisionPage = ({ darkMode }) => {
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDivision, setEditingDivision] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  const [nomFr, setNomFr] = useState("");
  const [nomAr, setNomAr] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // 🔹 Fetch divisions
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getDivisions();
      setDivisions(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Erreur fetch divisions:", err);
      toast.error(t('divisionPage.errors.loadData', 'Erreur lors du chargement des divisions'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // 🔹 Filtered divisions based on search
  const filteredDivisions = divisions.filter(d =>
    (d.lib_division_fr?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     d.lib_division_ar?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 🔹 Paginated divisions
  const paginatedDivisions = filteredDivisions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleShowModal = (division = null) => {
    setEditingDivision(division);
    setNomFr(division?.lib_division_fr || "");
    setNomAr(division?.lib_division_ar || "");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!nomFr.trim() || !nomAr.trim()) {
      toast.warning(t('divisionPage.warnings.requiredFields', 'Les noms en français et en arabe sont obligatoires'));
      return;
    }

    const divisionData = { lib_division_fr: nomFr, lib_division_ar: nomAr, nom_division: nomFr };
    try {
      if (editingDivision) await updateDivision(editingDivision.id_division, divisionData);
      else await createDivision(divisionData);

      toast.success(editingDivision ? 
        t('divisionPage.success.updated', 'Division modifiée !') : 
        t('divisionPage.success.created', 'Division créée !')
      );
      fetchData();
      setShowModal(false);
    } catch (err) {
      console.error("Erreur save division:", err);
      toast.error(t('divisionPage.errors.saveError', 'Erreur lors de l\'enregistrement'));
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteDivision(deleteId);
      toast.success(t('divisionPage.success.deleted', 'Division supprimée !'));
      setShowConfirm(false);
      setDeleteId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(t('divisionPage.errors.deleteError', 'Erreur lors de la suppression'));
    }
  };

  if (loading) return (
    <div className={`text-center p-4 ${darkMode ? "text-light bg-dark" : ""}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <Spinner animation="border" />
      <div className="mt-2">{t('divisionPage.loading', 'Chargement des divisions...')}</div>
    </div>
  );

  return (
    <div 
      className={`container mt-4 ${darkMode ? "text-light bg-dark" : ""}`} 
      style={{ direction: isRTL ? 'rtl' : 'ltr', minHeight: '100vh' }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{t('divisionPage.title', 'Gestion des Divisions')}</h2>
        <Button 
          className={darkMode ? "btn-outline-light" : "btn-primary"} 
          onClick={() => handleShowModal()}
        >
          {t('divisionPage.newDivision', '+ Nouvelle Division')}
        </Button>
      </div>

      <Form.Group className="mb-3">
        <Form.Control 
          type="text" 
          placeholder={t('divisionPage.search.placeholder', 'Recherche...')} 
          value={searchTerm} 
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </Form.Group>

      <div className="table-responsive">
        <Table striped bordered hover className={darkMode ? "table-dark" : ""}>
          <thead>
            <tr>
              <th>{t('divisionPage.table.id', 'ID')}</th>
              <th>{t('divisionPage.table.nameFr', 'Nom FR')}</th>
              <th>{t('divisionPage.table.nameAr', 'Nom AR')}</th>
              <th className="text-center">{t('divisionPage.table.actions', 'Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDivisions.length > 0 ? (
              paginatedDivisions.map((d, index) => (
                <tr key={d.id_division || d.id}>
                  <td>{(currentPage - 1) * pageSize + index + 1}</td>
                  <td style={{ direction: 'ltr', textAlign: 'left' }}>{d.lib_division_fr || "-"}</td>
                  <td style={{ direction: 'rtl', textAlign: 'right' }}>{d.lib_division_ar || "-"}</td>
                  <td className="text-center">
                    <Button 
                      variant={darkMode ? "outline-warning" : "warning"} 
                      size="sm" 
                      className={isRTL ? "ms-1" : "me-1"}
                      onClick={() => handleShowModal(d)}
                    >
                      {t('divisionPage.buttons.edit', '✏️ Modifier')}
                    </Button>
                    <Button 
                      variant={darkMode ? "outline-danger" : "danger"} 
                      size="sm" 
                      onClick={() => handleDeleteClick(d.id_division || d.id)}
                    >
                      {t('divisionPage.buttons.delete', '🗑️ Supprimer')}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  {t('divisionPage.noData', 'Aucune division trouvée')}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <PaginationComponent
        totalItems={filteredDivisions.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        data-bs-theme={darkMode ? "dark" : ""}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingDivision ? 
              t('divisionPage.modal.editTitle', 'Modifier Division') : 
              t('divisionPage.modal.newTitle', 'Nouvelle Division')
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{t('divisionPage.form.nameFr', 'Nom FR')}</Form.Label>
              <Form.Control 
                type="text" 
                value={nomFr} 
                onChange={(e) => setNomFr(e.target.value)} 
                className={darkMode ? "bg-secondary text-light" : ""}
                dir="ltr"
                style={{ textAlign: 'left' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('divisionPage.form.nameAr', 'Nom AR')}</Form.Label>
              <Form.Control 
                type="text" 
                value={nomAr} 
                onChange={(e) => setNomAr(e.target.value)} 
                className={darkMode ? "bg-secondary text-light" : ""}
                dir="rtl"
                style={{ textAlign: 'right' }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: isRTL ? 'flex-start' : 'flex-end' }}>
          <Button 
            variant={darkMode ? "btn-outline-light" : "secondary"} 
            onClick={() => setShowModal(false)}
          >
            {t('divisionPage.buttons.cancel', 'Annuler')}
          </Button>
          <Button 
            variant={darkMode ? "btn-outline-primary" : "primary"} 
            onClick={handleSave}
          >
            {t('divisionPage.buttons.save', 'Enregistrer')}
          </Button>
        </Modal.Footer>
      </Modal>

      <ConfirmModal
        show={showConfirm}
        title={t('divisionPage.deleteConfirm.title', 'Supprimer Division')}
        message={t('divisionPage.deleteConfirm.message', 'Êtes-vous sûr de vouloir supprimer cette division ? Cette action est irréversible.')}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
        darkMode={darkMode}
      />
    </div>
  );
};

export default DivisionPage;

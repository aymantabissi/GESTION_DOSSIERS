// src/pages/division/DivisionPage.jsx
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Spinner, Row, Col, Card, Badge } from "react-bootstrap";
import { createDivision, updateDivision, deleteDivision } from "../../api/divisionApi";
import { getDivisions } from "../../api/dossierApi";
import { toast } from "react-toastify";
import ConfirmModal from "../../compenents/ConfirmModal";
import { useTranslation } from "react-i18next";
import PaginationComponent from "../../compenents/PaginationComponent";
import renderMobileCards from "./renderMobileCards";

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

  // Render mobile card view for small screens
  const renderMobileCards = () => (
    <div className="d-md-none">
      {paginatedDivisions.length > 0 ? (
        paginatedDivisions.map((d, index) => (
          <Card 
            key={d.id_division || d.id} 
            className={`mb-3 ${darkMode ? "bg-secondary text-light border-secondary" : ""}`}
          >
            <Card.Body>
              <Row className="align-items-center">
                <Col xs={8}>
                  <div className="mb-2">
                    <strong className="d-block">{t('divisionPage.table.id', 'ID')}: </strong>
                    <span>{(currentPage - 1) * pageSize + index + 1}</span>
                  </div>
                  <div className="mb-2">
                    <strong className="d-block">{t('divisionPage.table.nameFr', 'Nom FR')}: </strong>
                    <span style={{ direction: 'ltr', textAlign: 'left' }}>
                      {d.lib_division_fr || "-"}
                    </span>
                  </div>
                  <div className="mb-2">
                    <strong className="d-block">{t('divisionPage.table.nameAr', 'Nom AR')}: </strong>
                    <span style={{ direction: 'rtl', textAlign: 'right' }}>
                      {d.lib_division_ar || "-"}
                    </span>
                  </div>
                </Col>
                <Col xs={4} className="text-end">
                  <div className="d-flex flex-column gap-2">
                    <Button 
                      variant={darkMode ? "outline-warning" : "warning"} 
                      size="sm" 
                      onClick={() => handleShowModal(d)}
                      className="w-100"
                    >
                      <span className="d-none d-sm-inline">{t('divisionPage.buttons.edit', '✏️ Modifier')}</span>
                      <span className="d-sm-none">✏️</span>
                    </Button>
                    <Button 
                      variant={darkMode ? "outline-danger" : "danger"} 
                      size="sm" 
                      onClick={() => handleDeleteClick(d.id_division || d.id)}
                      className="w-100"
                    >
                      <span className="d-none d-sm-inline">{t('divisionPage.buttons.delete', '🗑️ Supprimer')}</span>
                      <span className="d-sm-none">🗑️</span>
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      ) : (
        <Card className={`text-center ${darkMode ? "bg-secondary text-light border-secondary" : ""}`}>
          <Card.Body>
            <p className="mb-0">{t('divisionPage.noData', 'Aucune division trouvée')}</p>
          </Card.Body>
        </Card>
      )}
    </div>
  );

  if (loading) return (
    <div className={`text-center p-4 ${darkMode ? "text-light bg-dark" : ""}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <Spinner animation="border" />
      <div className="mt-2">{t('divisionPage.loading', 'Chargement des divisions...')}</div>
    </div>
  );

  return (
    <div 
      className={`container-fluid px-3 px-md-4 mt-4 ${darkMode ? "text-light bg-dark" : ""}`} 
      style={{ direction: isRTL ? 'rtl' : 'ltr', minHeight: '100vh' }}
    >
      {/* Header Section */}
      <Row className="mb-3 align-items-center">
        <Col xs={12} md={8} lg={9}>
          <h2 className="mb-2 mb-md-0">{t('divisionPage.title', 'Gestion des Divisions')}</h2>
        </Col>
        <Col xs={12} md={4} lg={3} className="text-md-end">
          <Button 
            className={`w-100 w-md-auto ${darkMode ? "btn-outline-light" : "btn-primary"}`}
            onClick={() => handleShowModal()}
          >
            <span className="d-inline d-sm-none">+</span>
            <span className="d-none d-sm-inline">{t('divisionPage.newDivision', '+ Nouvelle Division')}</span>
          </Button>
        </Col>
      </Row>

      {/* Search Section */}
      <Row className="mb-3">
        <Col xs={12} md={8} lg={6}>
          <Form.Group>
            <Form.Control 
              type="text" 
              placeholder={t('divisionPage.search.placeholder', 'Recherche...')} 
              value={searchTerm} 
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className={darkMode ? "bg-secondary text-light border-secondary" : ""}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Desktop Table View - Hidden on mobile */}
      <div className="d-none d-md-block">
        <div className="table-responsive">
          <Table striped bordered hover className={darkMode ? "table-dark" : ""}>
            <thead>
              <tr>
                <th className="text-center" style={{ width: '10%' }}>
                  {t('divisionPage.table.id', 'ID')}
                </th>
                <th style={{ width: '35%' }}>
                  {t('divisionPage.table.nameFr', 'Nom FR')}
                </th>
                <th style={{ width: '35%' }}>
                  {t('divisionPage.table.nameAr', 'Nom AR')}
                </th>
                <th className="text-center" style={{ width: '20%' }}>
                  {t('divisionPage.table.actions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedDivisions.length > 0 ? (
                paginatedDivisions.map((d, index) => (
                  <tr key={d.id_division || d.id}>
                    <td className="text-center align-middle">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="align-middle" style={{ direction: 'ltr', textAlign: 'left' }}>
                      <div className="text-truncate" title={d.lib_division_fr}>
                        {d.lib_division_fr || "-"}
                      </div>
                    </td>
                    <td className="align-middle" style={{ direction: 'rtl', textAlign: 'right' }}>
                      <div className="text-truncate" title={d.lib_division_ar}>
                        {d.lib_division_ar || "-"}
                      </div>
                    </td>
                    <td className="text-center align-middle">
                      <div className="d-flex justify-content-center gap-2 flex-wrap">
                        <Button 
                          variant={darkMode ? "outline-warning" : "warning"} 
                          size="sm" 
                          onClick={() => handleShowModal(d)}
                          className="d-flex align-items-center"
                        >
                          <span className="d-none d-lg-inline">{t('divisionPage.buttons.edit', '✏️ Modifier')}</span>
                          <span className="d-lg-none">✏️</span>
                        </Button>
                        <Button 
                          variant={darkMode ? "outline-danger" : "danger"} 
                          size="sm" 
                          onClick={() => handleDeleteClick(d.id_division || d.id)}
                          className="d-flex align-items-center"
                        >
                          <span className="d-none d-lg-inline">{t('divisionPage.buttons.delete', '🗑️ Supprimer')}</span>
                          <span className="d-lg-none">🗑️</span>
                        </Button>
                      </div>
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
      </div>

      {/* Mobile Card View - Visible only on mobile */}
      {renderMobileCards()}

      {/* Pagination */}
      <Row className="mt-4">
        <Col xs={12} className="d-flex justify-content-center">
          <PaginationComponent
            totalItems={filteredDivisions.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </Col>
      </Row>

      {/* Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        data-bs-theme={darkMode ? "dark" : ""}
        dir={isRTL ? 'rtl' : 'ltr'}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100">
            {editingDivision ? 
              t('divisionPage.modal.editTitle', 'Modifier Division') : 
              t('divisionPage.modal.newTitle', 'Nouvelle Division')
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('divisionPage.form.nameFr', 'Nom FR')}</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={nomFr} 
                    onChange={(e) => setNomFr(e.target.value)} 
                    className={darkMode ? "bg-secondary text-light border-secondary" : ""}
                    dir="ltr"
                    style={{ textAlign: 'left' }}
                    placeholder={t('divisionPage.form.nameFrPlaceholder', 'Entrez le nom en français')}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('divisionPage.form.nameAr', 'Nom AR')}</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={nomAr} 
                    onChange={(e) => setNomAr(e.target.value)} 
                    className={darkMode ? "bg-secondary text-light border-secondary" : ""}
                    dir="rtl"
                    style={{ textAlign: 'right' }}
                    placeholder={t('divisionPage.form.nameArPlaceholder', 'أدخل الاسم بالعربية')}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex flex-column flex-sm-row gap-2">
          <div className="d-flex gap-2 w-100 w-sm-auto" style={{ justifyContent: isRTL ? 'flex-start' : 'flex-end' }}>
            <Button 
              variant={darkMode ? "outline-light" : "secondary"} 
              onClick={() => setShowModal(false)}
              className="flex-fill flex-sm-grow-0"
            >
              {t('divisionPage.buttons.cancel', 'Annuler')}
            </Button>
            <Button 
              variant={darkMode ? "outline-primary" : "primary"} 
              onClick={handleSave}
              className="flex-fill flex-sm-grow-0"
            >
              {t('divisionPage.buttons.save', 'Enregistrer')}
            </Button>
          </div>
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

}
export default DivisionPage;

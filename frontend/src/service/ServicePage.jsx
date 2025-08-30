// src/pages/ServicePage.jsx
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Spinner, Card, Row, Col, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import { getServices, createService, updateService, deleteService } from "../api/serviceApi";
import { getDivisions } from "../api/divisionApi";
import ConfirmModal from "../compenents/ConfirmModal";
import PaginationComponent from "../compenents/PaginationComponent";
import { useTranslation } from "react-i18next";

// Mobile Cards Component
const RenderServiceMobileCards = ({ paginatedServices, darkMode, currentPage, pageSize, handleShowModal, handleDeleteClick }) => (
  <>
    {paginatedServices.length > 0 ? (
      paginatedServices.map((s, index) => (
        <Card key={s.id_service} className={`mb-3 ${darkMode ? "bg-secondary text-light border-secondary" : "border-light"}`}>
          <Card.Body>
            <Badge bg={darkMode ? "light" : "primary"} className="fs-6 mb-2">
              #{(currentPage - 1) * pageSize + index + 1}
            </Badge>
            <div><strong>Nom FR:</strong> {s.lib_service_fr}</div>
            <div><strong>Nom AR:</strong> {s.lib_service_ar || '-'}</div>
            <div><strong>Division:</strong> {s.division?.lib_division_fr || '-'}</div>
            <div className="d-flex gap-2 mt-2 justify-content-end">
              <Button variant={darkMode ? "outline-warning" : "warning"} size="sm" onClick={() => handleShowModal(s)}>✏️</Button>
              <Button variant={darkMode ? "outline-danger" : "danger"} size="sm" onClick={() => handleDeleteClick(s.id_service)}>🗑️</Button>
            </div>
          </Card.Body>
        </Card>
      ))
    ) : (
      <Card className={`text-center ${darkMode ? "bg-secondary text-light border-secondary" : ""}`}>
        <Card.Body>Aucun service trouvé</Card.Body>
      </Card>
    )}
  </>
);

const ServicePage = ({ darkMode = true }) => {
  const [services, setServices] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [libServiceFr, setLibServiceFr] = useState("");
  const [libServiceAr, setLibServiceAr] = useState("");
  const [idDivision, setIdDivision] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // 🔹 Fetch services et divisions
  const fetchData = async () => {
    try {
      setLoading(true);
      const divRes = await getDivisions();
      setDivisions(Array.isArray(divRes) ? divRes : []);
      const srvRes = await getServices();
      setServices(Array.isArray(srvRes) ? srvRes : []);
    } catch (err) {
      console.error(err);
      toast.error(t('servicePage.errors.loadData', 'Erreur chargement données'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // 🔹 Filter & Paginate
  const filteredServices = services.filter(s =>
    s.lib_service_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.lib_service_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.division?.lib_division_fr?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedServices = filteredServices.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 🔹 Modal Handlers
  const handleShowModal = (service = null) => {
    setEditingService(service);
    setLibServiceFr(service?.lib_service_fr || "");
    setLibServiceAr(service?.lib_service_ar || "");
    setIdDivision(service?.id_division || "");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!libServiceFr || !idDivision) {
      toast.warning(t('servicePage.warnings.requiredFields', 'Nom service et division obligatoires'));
      return;
    }

    const data = { lib_service_fr: libServiceFr, lib_service_ar: libServiceAr, id_division: Number(idDivision) };

    try {
      if (editingService) await updateService(editingService.id_service, data);
      else await createService(data);

      toast.success(editingService ? t('servicePage.success.updated', 'Service modifié !') : t('servicePage.success.created', 'Service créé !'));
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(t('servicePage.errors.saveError', 'Erreur enregistrement service'));
    }
  };

  // 🔹 Delete Handlers
  const handleDeleteClick = (id) => { setDeleteId(id); setShowConfirm(true); };
  const handleConfirmDelete = async () => {
    try {
      await deleteService(deleteId);
      toast.success(t('servicePage.success.deleted', 'Service supprimé !'));
      setShowConfirm(false);
      setDeleteId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(t('servicePage.errors.deleteError', 'Erreur lors de la suppression'));
    }
  };

  if (loading) return (
    <div className="text-center p-4">
      <Spinner animation="border" variant="primary" />
      <div className="mt-2">{t('servicePage.loading', 'Chargement des données...')}</div>
    </div>
  );

  return (
    <div className={`${darkMode ? "bg-dark text-light" : ""} container-fluid py-4`} style={{ minHeight: "100vh", direction: isRTL ? 'rtl' : 'ltr' }}>
      
      {/* Mobile Cards */}
      <div className="d-md-none">
        <RenderServiceMobileCards
          paginatedServices={paginatedServices}
          darkMode={darkMode}
          currentPage={currentPage}
          pageSize={pageSize}
          handleShowModal={handleShowModal}
          handleDeleteClick={handleDeleteClick}
        />
      </div>

      {/* Desktop Table */}
      <div className="d-none d-md-block">
        <Card bg={darkMode ? "dark" : "light"} text={darkMode ? "white" : "dark"} className="shadow">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">{t('servicePage.title', 'Gestion des Services')}</h3>
            <Button variant="primary" onClick={() => handleShowModal()}>{t('servicePage.newService', '+ Nouveau Service')}</Button>
          </Card.Header>

          <Card.Body className="p-0">
            <div className="p-3">
              <Form.Control
                type="text"
                placeholder={t('servicePage.search.placeholder', 'Recherche...')}
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="mb-3"
              />
            </div>
            <Table striped bordered hover variant={darkMode ? "dark" : ""} className="mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom FR</th>
                  <th>Nom AR</th>
                  <th>Division</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedServices.length > 0 ? (
                  paginatedServices.map((s, i) => (
                    <tr key={s.id_service}>
                      <td>{(currentPage - 1) * pageSize + i + 1}</td>
                      <td>{s.lib_service_fr}</td>
                      <td>{s.lib_service_ar || '-'}</td>
                      <td>{s.division?.lib_division_fr || '-'}</td>
                      <td className="text-center">
                        <Button variant="outline-warning" size="sm" className="me-1" onClick={() => handleShowModal(s)}>✏️</Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(s.id_service)}>🗑️</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">Aucun service trouvé</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>

      {/* Pagination */}
      <PaginationComponent
        totalItems={filteredServices.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* Modal Service */}
      <Modal show={showModal} onHide={() => setShowModal(false)} data-bs-theme={darkMode ? "dark" : ""} dir={isRTL ? 'rtl' : 'ltr'}>
        <Modal.Header closeButton>
          <Modal.Title>{editingService ? t('servicePage.modal.editTitle', 'Modifier Service') : t('servicePage.modal.newTitle', 'Nouveau Service')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nom Service FR</Form.Label>
              <Form.Control type="text" value={libServiceFr} onChange={e => setLibServiceFr(e.target.value)} dir="ltr"/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nom Service AR</Form.Label>
              <Form.Control type="text" value={libServiceAr} onChange={e => setLibServiceAr(e.target.value)} dir="rtl"/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Division</Form.Label>
              <Form.Select value={idDivision} onChange={e => setIdDivision(e.target.value)} dir={isRTL ? 'rtl' : 'ltr'}>
                <option value="">-- Choisir division --</option>
                {divisions.map(d => <option key={d.id_division || d.id} value={d.id_division || d.id}>{d.lib_division_fr || '-'}</option>)}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="justify-content-end">
          <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
          <Button variant="primary" onClick={handleSave}>Enregistrer</Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Modal */}
      <ConfirmModal
        show={showConfirm}
        title="Supprimer Service"
        message="Êtes-vous sûr de vouloir supprimer ce service ?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
        darkMode={darkMode}
      />
    </div>
  );
};

export default ServicePage;

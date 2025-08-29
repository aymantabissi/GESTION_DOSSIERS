// src/pages/ServicePage.jsx
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Spinner, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { getServices, createService, updateService, deleteService } from "../api/serviceApi";
import { getDivisions } from "../api/divisionApi";
import ConfirmModal from "../compenents/ConfirmModal";
import PaginationComponent from "../compenents/PaginationComponent";
import { useTranslation } from "react-i18next";

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

  // 🔹 Filter services by search
  const filteredServices = services.filter(s =>
    (s.lib_service_fr?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     s.lib_service_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     s.division?.lib_division_fr?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 🔹 Paginated services
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 🔹 Open modal
  const handleShowModal = (service = null) => {
    setEditingService(service);
    setLibServiceFr(service?.lib_service_fr || "");
    setLibServiceAr(service?.lib_service_ar || "");
    setIdDivision(service?.id_division || "");
    setShowModal(true);
  };

  // 🔹 Save service
  const handleSave = async () => {
    if (!libServiceFr || !idDivision) {
      toast.warning(t('servicePage.warnings.requiredFields', 'Nom service et division obligatoires'));
      return;
    }

    const data = { lib_service_fr: libServiceFr, lib_service_ar: libServiceAr, id_division: Number(idDivision) };

    try {
      if (editingService) await updateService(editingService.id_service, data);
      else await createService(data);

      toast.success(editingService ? 
        t('servicePage.success.updated', 'Service modifié !') : 
        t('servicePage.success.created', 'Service créé !')
      );
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(t('servicePage.errors.saveError', 'Erreur enregistrement service'));
    }
  };

  // 🔹 Confirm delete
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

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
    <div className={`${darkMode ? "bg-dark text-light" : ""} container-fluid py-4`} 
         style={{ minHeight: "100vh", direction: isRTL ? 'rtl' : 'ltr' }}>

      <Card bg={darkMode ? "dark" : "light"} text={darkMode ? "white" : "dark"} className="shadow">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">{t('servicePage.title', 'Gestion des Services')}</h3>
          <Button variant="primary" onClick={() => handleShowModal()}>
            {t('servicePage.newService', '+ Nouveau Service')}
          </Button>
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

          <div className="table-responsive">
            <Table striped bordered hover variant={darkMode ? "dark" : ""} className="mb-0">
              <thead>
                <tr>
                  <th className="text-center">{t('servicePage.table.id', 'ID')}</th>
                  <th>{t('servicePage.table.nameFr', 'Nom FR')}</th>
                  <th>{t('servicePage.table.nameAr', 'Nom AR')}</th>
                  <th>{t('servicePage.table.division', 'Division')}</th>
                  <th className="text-center">{t('servicePage.table.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {paginatedServices.length > 0 ? (
                  paginatedServices.map((s, index) => (
                    <tr key={s.id_service}>
                      <td className="text-center">{(currentPage - 1) * pageSize + index + 1}</td>
                      <td style={{ direction: 'ltr', textAlign: 'left' }}>{s.lib_service_fr}</td>
                      <td style={{ direction: 'rtl', textAlign: 'right' }}>{s.lib_service_ar || '-'}</td>
                      <td>{s.division?.lib_division_fr || s.division?.nom_division || '-'}</td>
                      <td className="text-center">
                        <Button 
                          variant="outline-warning" 
                          size="sm" 
                          className={isRTL ? "ms-1" : "me-1"} 
                          onClick={() => handleShowModal(s)}
                          style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                        >
                          {t('servicePage.buttons.edit', '✏️')}
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => handleDeleteClick(s.id_service)}
                          style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                        >
                          {t('servicePage.buttons.delete', '🗑️')}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      {t('servicePage.noData', 'Aucun service trouvé')}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <PaginationComponent
            totalItems={filteredServices.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </Card.Body>
      </Card>

      {/* Modal Service */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        data-bs-theme={darkMode ? "dark" : ""}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingService ? 
              t('servicePage.modal.editTitle', 'Modifier Service') : 
              t('servicePage.modal.newTitle', 'Nouveau Service')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{t('servicePage.form.nameFr', 'Nom Service FR')}</Form.Label>
              <Form.Control
                type="text"
                value={libServiceFr}
                onChange={e => setLibServiceFr(e.target.value)}
                dir="ltr"
                style={{ textAlign: 'left' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('servicePage.form.nameAr', 'Nom Service AR')}</Form.Label>
              <Form.Control
                type="text"
                value={libServiceAr}
                onChange={e => setLibServiceAr(e.target.value)}
                dir="rtl"
                style={{ textAlign: 'right' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('servicePage.form.division', 'Division')}</Form.Label>
              <Form.Select
                value={idDivision}
                onChange={e => setIdDivision(e.target.value)}
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                <option value="">-- {t('servicePage.form.chooseDivision', 'Choisir division')} --</option>
                {divisions.map(d => (
                  <option key={d.id_division || d.id} value={d.id_division || d.id}>
                    {d.lib_division_fr || d.nom_division || t('servicePage.form.unnamedDivision', 'Division sans nom')}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: isRTL ? 'flex-start' : 'flex-end' }}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t('servicePage.buttons.cancel', 'Annuler')}
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {t('servicePage.buttons.save', 'Enregistrer')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Modal */}
      <ConfirmModal
        show={showConfirm}
        title={t('servicePage.deleteConfirm.title', 'Supprimer Service')}
        message={t('servicePage.deleteConfirm.message', 'Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.')}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
        darkMode={darkMode}
      />
    </div>
  );
};

export default ServicePage;

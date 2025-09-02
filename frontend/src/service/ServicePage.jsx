// src/pages/ServicePage.jsx
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Spinner, Card, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import { getServices, createService, updateService, deleteService, exportServicesPDF, exportServicesCSV } from "../api/serviceApi";
import { getDivisions } from "../api/divisionApi";
import ExportComponent from "../pages/division/ExportComponent";
import ConfirmModal from "../compenents/ConfirmModal";
import PaginationComponent from "../compenents/PaginationComponent";

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

  const fetchData = async () => {
    try {
      setLoading(true);
      const divs = await getDivisions();
      setDivisions(Array.isArray(divs) ? divs : []);
      const srvs = await getServices();
      setServices(Array.isArray(srvs) ? srvs : []);
    } catch (err) {
      console.error(err);
      toast.error('Erreur chargement données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Filter & paginate
  const filteredServices = services.filter(s =>
    s.lib_service_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.lib_service_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.division?.lib_division_fr?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedServices = filteredServices.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Modal handlers
  const handleShowModal = (service = null) => {
    setEditingService(service);
    setLibServiceFr(service?.lib_service_fr || "");
    setLibServiceAr(service?.lib_service_ar || "");
    setIdDivision(service?.id_division || "");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!libServiceFr || !idDivision) {
      toast.warning('Nom service et division obligatoires');
      return;
    }
    const data = { lib_service_fr: libServiceFr, lib_service_ar: libServiceAr, id_division: Number(idDivision) };
    try {
      if (editingService) await updateService(editingService.id_service, data);
      else await createService(data);
      toast.success(editingService ? 'Service modifié !' : 'Service créé !');
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Erreur enregistrement service');
    }
  };

  // Delete handlers
  const handleDeleteClick = (id) => { setDeleteId(id); setShowConfirm(true); };
  const handleConfirmDelete = async () => {
    try {
      await deleteService(deleteId);
      toast.success('Service supprimé !');
      setShowConfirm(false);
      setDeleteId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) return (
    <div className="text-center p-4">
      <Spinner animation="border" variant="primary" />
      <div className="mt-2">Chargement des données...</div>
    </div>
  );

  return (
    <div className={`${darkMode ? "bg-dark text-light" : ""} container-fluid py-4`} style={{ minHeight: "100vh" }}>
      
      <Card bg={darkMode ? "dark" : "light"} text={darkMode ? "white" : "dark"} className="shadow mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Gestion des Services</h3>
          <div className="d-flex gap-2">
            <Button variant="primary" size="sm" onClick={() => handleShowModal()}>+ Nouveau Service</Button>
            <ExportComponent
              darkMode={darkMode}
              onExportPDF={exportServicesPDF}
              onExportCSV={exportServicesCSV}
              size="sm"
            />
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          <div className="p-3">
            <Form.Control
              type="text"
              placeholder="Recherche..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="mb-3"
            />
          </div>
          <Table striped bordered hover variant={darkMode ? "dark" : ""} className="mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Nom FR</th>
                <th>Nom AR</th>
                <th>Division</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedServices.length > 0 ? paginatedServices.map((s, i) => (
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
              )) : (
                <tr><td colSpan="5" className="text-center py-4">Aucun service trouvé</td></tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <PaginationComponent
        totalItems={filteredServices.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* Modal Service */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingService ? 'Modifier Service' : 'Nouveau Service'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nom Service FR</Form.Label>
              <Form.Control type="text" value={libServiceFr} onChange={e => setLibServiceFr(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nom Service AR</Form.Label>
              <Form.Control type="text" value={libServiceAr} onChange={e => setLibServiceAr(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Division</Form.Label>
              <Form.Select value={idDivision} onChange={e => setIdDivision(e.target.value)}>
                <option value="">-- Choisir division --</option>
                {divisions.map(d => <option key={d.id_division || d.id} value={d.id_division || d.id}>{d.lib_division_fr || '-'}</option>)}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
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

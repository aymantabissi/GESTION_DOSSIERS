import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { createDossier, updateDossier, getDivisions, getServices } from "../api/dossierApi";

const DossierModal = ({ show, handleClose, dossier, onSuccess }) => {
  const [intitule, setIntitule] = useState("");
  const [division, setDivision] = useState("");
  const [service, setService] = useState("");
  const [divisions, setDivisions] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const divs = await getDivisions();
        const servs = await getServices();
        setDivisions(divs);
        setServices(servs);
      } catch (err) {
        console.error("Erreur de chargement des données:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (dossier) {
      setIntitule(dossier.intitule_dossier || "");
      setDivision(dossier.id_division || "");
      setService(dossier.id_service || "");
    } else {
      setIntitule("");
      setDivision("");
      setService("");
    }
  }, [dossier]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (dossier) {
        await updateDossier(dossier.id_dossier, {
          intitule_dossier: intitule,
          id_division: division,
          id_service: service,
        });
      } else {
        await createDossier({
          intitule_dossier: intitule,
          id_division: division,
          id_service: service,
        });
      }
      onSuccess();
      handleClose();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du dossier:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{dossier ? "Modifier Dossier" : "Nouveau Dossier"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Intitulé</Form.Label>
            <Form.Control
              type="text"
              value={intitule}
              onChange={(e) => setIntitule(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Division</Form.Label>
            <Form.Select value={division} onChange={(e) => setDivision(e.target.value)} required>
              <option value="">-- Sélectionner --</option>
              {divisions.map((div) => (
                <option key={div.id_division} value={div.id_division}>
                  {div.lib_division_fr}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Service</Form.Label>
            <Form.Select value={service} onChange={(e) => setService(e.target.value)} required>
              <option value="">-- Sélectionner --</option>
              {services.map((srv) => (
                <option key={srv.id_service} value={srv.id_service}>
                  {srv.lib_service_fr}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Annuler
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : dossier ? "Modifier" : "Créer"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DossierModal;

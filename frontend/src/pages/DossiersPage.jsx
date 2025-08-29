// src/pages/DossiersPage.jsx
import React, { useState } from 'react';
import { Container, Modal } from 'react-bootstrap';
import DossierList from './dosssier/DossierList';

import DossierForm from './dosssier/DossierForm';

const DossiersPage = ({ darkMode }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingDossier, setEditingDossier] = useState(null);

  const handleEdit = (dossier) => {
    setEditingDossier(dossier);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingDossier(null);
    setShowModal(true);
  };

  return (
    <Container fluid className="pt-1" style={{ paddingTop: '70px' }}>
      <DossierList onEdit={handleEdit} onAdd={handleAdd} darkMode={darkMode} />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingDossier ? 'Modifier Dossier' : 'Ajouter Dossier'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DossierForm dossier={editingDossier} onSuccess={() => setShowModal(false)} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default DossiersPage;
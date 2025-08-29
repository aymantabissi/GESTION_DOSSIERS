import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const InstructionsForm = ({ onAdd }) => {
  const [libelle, setLibelle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!libelle.trim()) return;
    onAdd({ libelle_instruction: libelle });
    setLibelle('');
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-3">
      <Form.Group className="mb-2">
        <Form.Label>Libellé de l'instruction</Form.Label>
        <Form.Control
          type="text"
          value={libelle}
          onChange={(e) => setLibelle(e.target.value)}
          placeholder="Entrez l'instruction"
          required
        />
      </Form.Group>
      <Button type="submit">Ajouter</Button>
    </Form>
  );
};

export default InstructionsForm;

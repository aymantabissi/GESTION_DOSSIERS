import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { FaEdit, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { createInstruction, getInstructions } from '../../api/instructionApi';

const NewInstructionModal = ({
  show,
  setShow,
  fetchData,
  setSelectedInstructions,
  quickInstructionTemplates,
  themeClasses
}) => {
  const { t } = useTranslation();
  const [newInstructionName, setNewInstructionName] = useState('');
  const [newInstructionDescription, setNewInstructionDescription] = useState('');
  const [creatingInstruction, setCreatingInstruction] = useState(false);

  const applyQuickTemplate = (template) => {
    setNewInstructionName(template.name);
    setNewInstructionDescription(template.description);
  };

  const handleCreateInstruction = async () => {
    if (!newInstructionName.trim()) {
      toast.error(t('warnings.requiredFields'));
      return;
    }

    try {
      setCreatingInstruction(true);

      const newInstruction = await createInstruction({
        libelle_instruction: newInstructionName.trim(),
        description: newInstructionDescription.trim()
      });

      // Refresh instructions list
      await fetchData();

      // Get updated instructions
      const updatedInstructions = await getInstructions();
      const createdInstruction = updatedInstructions.find(inst => 
        inst.libelle_instruction === newInstructionName.trim()
      ) || newInstruction;

      setSelectedInstructions(prev => [createdInstruction, ...prev]);
      toast.success(t('alerts.readyToAssign', { count: 1, dossierId: '...' }));

      // Reset modal
      setNewInstructionName('');
      setNewInstructionDescription('');
      setShow(false);
    } catch (err) {
      console.error(t('errors.saveError'), err);
      toast.error(t('errors.saveError') + ': ' + (err.response?.data?.message || err.message || t('errors.serverError')));
    } finally {
      setCreatingInstruction(false);
    }
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
      <Modal.Header closeButton className={themeClasses.modalBg}>
        <Modal.Title>
          <FaEdit className="me-2 text-primary" />
          {t('modal.createNewInstruction')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={themeClasses.modalBg}>
        <div className="mb-4">
          <h6 className="fw-bold mb-3">{t('modal.quickTemplates')}</h6>
          <div className="row g-2">
            {quickInstructionTemplates.map((template, index) => (
              <div key={index} className="col-md-6">
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="w-100 text-start"
                  onClick={() => applyQuickTemplate(template)}
                >
                  <small>{template.name}</small>
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              {t('modal.instructionName')} <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder={t('modal.instructionName')}
              value={newInstructionName}
              onChange={(e) => setNewInstructionName(e.target.value)}
              className={themeClasses.inputClass}
              size="lg"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">{t('modal.descriptionOptional')}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder={t('modal.descriptionOptional')}
              value={newInstructionDescription}
              onChange={(e) => setNewInstructionDescription(e.target.value)}
              className={themeClasses.inputClass}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className={themeClasses.modalBg}>
        <Button variant="secondary" onClick={() => setShow(false)}>
          {t('modal.cancel')}
        </Button>
        <Button 
          variant="primary" 
          onClick={handleCreateInstruction} 
          disabled={creatingInstruction}
        >
          {creatingInstruction ? (
            <Spinner animation="border" size="sm" className="me-2" />
          ) : (
            <FaSave className="me-1" />
          )}
          {t('modal.createAndAdd')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewInstructionModal;
import React from 'react';
import { Card, ListGroup, Button, Badge } from 'react-bootstrap';
import { FaLayerGroup, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const SelectedInstructionsList = ({ selectedInstructions, handleRemoveInstruction, themeClasses }) => {
  const { t } = useTranslation();
  
  return (
    <Card className={`shadow border-0 ${themeClasses.cardBg}`}>
      <Card.Header className={`${themeClasses.listBg} border-0`}>
        <h6 className="mb-0 fw-bold">
          <FaLayerGroup className="me-2" />
          {selectedInstructions.length > 0 
            ? t('modal.instructionsSelected', { count: selectedInstructions.length })
            : t('modal.instructions none Selected')
          }
        </h6>
      </Card.Header>
      <Card.Body className="p-0" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {selectedInstructions.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <FaLayerGroup className="fs-1 mb-3 opacity-25" />
            <p className="mb-0">{t('modal.instructions none Selected')}</p>
          </div>
        ) : (
          <ListGroup variant="flush">
            {selectedInstructions.map((instruction, index) => (
              <ListGroup.Item
                key={instruction.id_instruction}
                className={`d-flex justify-content-between align-items-start ${themeClasses.cardBg}`}
              >
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center mb-1">
                    <Badge bg="success" className="me-2">{index + 1}</Badge>
                    <strong className="text-truncate">{instruction.libelle_instruction}</strong>
                  </div>
                  {instruction.description && (
                    <small className="text-muted d-block ms-4">
                      {instruction.description}
                    </small>
                  )}
                </div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleRemoveInstruction(instruction.id_instruction)}
                  className="ms-2 flex-shrink-0"
                  aria-label={t('form.clearAll')}
                >
                  <FaTimes />
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default SelectedInstructionsList;
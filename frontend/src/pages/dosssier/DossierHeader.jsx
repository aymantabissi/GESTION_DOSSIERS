import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { FaEye, FaPlus, FaSync, FaTrash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const DossierHeader = ({ 
  filteredDossiersCount, 
  selectedCount, 
  onAdd, 
  onBulkDelete, 
  onRefresh, 
  darkMode 
}) => {
  const { t } = useTranslation();

  const headerBg = darkMode ? '#2a2a2a' : '#0d6efd';
  const textColor = darkMode ? '#fff' : '#fff';
  const subTextColor = darkMode ? '#ccc' : '#e0e0e0';

  return (
    <Card.Header className="py-3" style={{ backgroundColor: headerBg, border: 'none' }}>
      <Row className="align-items-center">
        <Col>
          <h4 className="mb-1 fw-bold" style={{ color: textColor }}>
            <FaEye className="me-2" /> {t('Dossiers.Gstion des dossiers')}
          </h4>
          <p className="mb-0" style={{ color: subTextColor }}>
            {t('dashboard.dossiersRecents', { count: filteredDossiersCount }) || `${filteredDossiersCount} dossier(s) trouvé(s)`}
          </p>
        </Col>
        <Col xs="auto">
          <div className="d-flex gap-2">
            {selectedCount > 0 && (
              <Button 
                variant={darkMode ? 'danger' : 'outline-danger'} 
                size="sm" 
                onClick={onBulkDelete} 
                className="d-flex align-items-center"
              >
                <FaTrash className="me-1" /> {t('buttons.delete')} ({selectedCount})
              </Button>
            )}
            <Button 
              variant="success" 
              size="sm" 
              onClick={onAdd} 
              className="d-flex align-items-center"
            >
              <FaPlus className="me-1" /> {t('dashboard.nouveauDossier')}
            </Button>
      <Button 
  variant={darkMode ? 'outline-light' : 'outline-light'} 
  size="sm" 
  onClick={onRefresh}  // <--- m3tih mn parent
  className="d-flex align-items-center"
>
  <FaSync />
</Button>
          </div>
        </Col>
      </Row>
    </Card.Header>
  );
};

export default DossierHeader;

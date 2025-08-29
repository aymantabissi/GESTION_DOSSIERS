import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { FaFileAlt, FaTasks, FaLayerGroup, FaCheckCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';


const StatsCards = ({ dossiers, instructions, selectedInstructions, dossierId, darkMode }) => {
     const { t } = useTranslation();
  return (
     <Row className="g-3 mb-4">
      <Col sm={6} lg={3}>
        <Card className={`border-0 shadow-sm h-100 bg-info text-white`}>
          <Card.Body className="text-center py-3">
            <FaFileAlt className="fs-2 mb-2 opacity-75" />
            <h5 className="fw-bold mb-1">{dossiers.length}</h5>
            <small className="opacity-75">{t('stats.availableDossiers')}</small>
          </Card.Body>
        </Card>
      </Col>
      <Col sm={6} lg={3}>
        <Card className={`border-0 shadow-sm h-100 bg-success text-white`}>
          <Card.Body className="text-center py-3">
            <FaTasks className="fs-2 mb-2 opacity-75" />
            <h5 className="fw-bold mb-1">{instructions.length}</h5>
            <small className="opacity-75">{t('stats.availableInstructions')}</small>
          </Card.Body>
        </Card>
      </Col>
      <Col sm={6} lg={3}>
        <Card className={`border-0 shadow-sm h-100 bg-warning text-white`}>
          <Card.Body className="text-center py-3">
            <FaLayerGroup className="fs-2 mb-2 opacity-75" />
            <h5 className="fw-bold mb-1">{selectedInstructions.length}</h5>
            <small className="opacity-75">{t('stats.selectedInstructions')}</small>
          </Card.Body>
        </Card>
      </Col>
      <Col sm={6} lg={3}>
        <Card className={`border-0 shadow-sm h-100 bg-primary text-white`}>
          <Card.Body className="text-center py-3">
            <FaCheckCircle className="fs-2 mb-2 opacity-75" />
            <h5 className="fw-bold mb-1">{dossierId ? '1' : '0'}</h5>
            <small className="opacity-75">{t('stats.selectedDossier')}</small>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default StatsCards;

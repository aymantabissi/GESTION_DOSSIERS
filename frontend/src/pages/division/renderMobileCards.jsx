import React from "react";
import { Table, Button, Modal, Form, Spinner, Row, Col, Card, Badge } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const RenderMobileCards = ({
  paginatedDivisions,
  darkMode,
  currentPage,
  pageSize,
  handleShowModal,
  handleDeleteClick
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="d-md-none">
      {paginatedDivisions.length > 0 ? (
        paginatedDivisions.map((d, index) => (
          <Card 
            key={d.id_division || d.id} 
            className={`mb-3 ${darkMode ? "bg-secondary text-light border-secondary" : "border-light"}`}
          >
            <Card.Body className="p-3">
              <Row className="align-items-start">
                <Col xs={12} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Badge 
                      bg={darkMode ? "outline-light" : "primary"} 
                      className="fs-6"
                    >
                      #{(currentPage - 1) * pageSize + index + 1}
                    </Badge>
                  </div>
                  
                  <div className="mb-2">
                    <small className="text-muted d-block mb-1">
                      {t('divisionPage.table.nameFr', 'Nom FR')}
                    </small>
                    <div style={{ direction: 'ltr', textAlign: 'left' }} className="fw-medium">
                      {d.lib_division_fr || "-"}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <small className="text-muted d-block mb-1">
                      {t('divisionPage.table.nameAr', 'Nom AR')}
                    </small>
                    <div style={{ direction: 'rtl', textAlign: 'right' }} className="fw-medium">
                      {d.lib_division_ar || "-"}
                    </div>
                  </div>
                </Col>
                
                <Col xs={12}>
                  <div className="d-flex gap-2 justify-content-end">
                    <Button 
                      variant={darkMode ? "outline-warning" : "warning"} 
                      size="sm" 
                      onClick={() => handleShowModal(d)}
                      className="flex-fill flex-sm-grow-0"
                    >
                      <span className="d-none d-sm-inline">{t('divisionPage.buttons.edit', '✏️ Modifier')}</span>
                      <span className="d-sm-none">✏️ {t('divisionPage.buttons.edit', 'Modifier').split(' ')[1]}</span>
                    </Button>
                    <Button 
                      variant={darkMode ? "outline-danger" : "danger"} 
                      size="sm" 
                      onClick={() => handleDeleteClick(d.id_division || d.id)}
                      className="flex-fill flex-sm-grow-0"
                    >
                      <span className="d-none d-sm-inline">{t('divisionPage.buttons.delete', '🗑️ Supprimer')}</span>
                      <span className="d-sm-none">🗑️ {t('divisionPage.buttons.delete', 'Supprimer').split(' ')[1]}</span>
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      ) : (
        <Card className={`text-center ${darkMode ? "bg-secondary text-light border-secondary" : ""}`}>
          <Card.Body className="py-5">
            <div className="text-muted mb-2">
              <i className="fas fa-inbox fa-3x"></i>
            </div>
            <p className="mb-0 fs-5">{t('divisionPage.noData', 'Aucune division trouvée')}</p>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default RenderMobileCards;

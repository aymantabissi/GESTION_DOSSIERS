import React from "react";
import { Card, Row, Col, Button, Badge } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const RenderServiceMobileCards = ({
  paginatedServices,
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
      {paginatedServices.length > 0 ? (
        paginatedServices.map((s, index) => (
          <Card 
            key={s.id_service} 
            className={`mb-3 ${darkMode ? "bg-secondary text-light border-secondary" : "border-light"}`}
          >
            <Card.Body className="p-3">
              <Row className="align-items-start">
                <Col xs={12} className="mb-3">
                  <Badge bg={darkMode ? "outline-light" : "primary"} className="fs-6 mb-2">
                    #{(currentPage - 1) * pageSize + index + 1}
                  </Badge>

                  <div className="mb-2">
                    <small className="text-muted d-block mb-1">{t('servicePage.table.nameFr', 'Nom FR')}</small>
                    <div style={{ direction: 'ltr', textAlign: 'left' }} className="fw-medium">
                      {s.lib_service_fr || "-"}
                    </div>
                  </div>

                  <div className="mb-2">
                    <small className="text-muted d-block mb-1">{t('servicePage.table.nameAr', 'Nom AR')}</small>
                    <div style={{ direction: 'rtl', textAlign: 'right' }} className="fw-medium">
                      {s.lib_service_ar || "-"}
                    </div>
                  </div>

                  <div className="mb-2">
                    <small className="text-muted d-block mb-1">{t('servicePage.table.division', 'Division')}</small>
                    <div className="fw-medium">
                      {s.division?.lib_division_fr || "-"}
                    </div>
                  </div>
                </Col>

                <Col xs={12}>
                  <div className="d-flex gap-2 justify-content-end">
                    <Button 
                      variant={darkMode ? "outline-warning" : "warning"} 
                      size="sm" 
                      onClick={() => handleShowModal(s)}
                      className="flex-fill flex-sm-grow-0"
                    >
                      ✏️
                    </Button>
                    <Button 
                      variant={darkMode ? "outline-danger" : "danger"} 
                      size="sm" 
                      onClick={() => handleDeleteClick(s.id_service)}
                      className="flex-fill flex-sm-grow-0"
                    >
                      🗑️
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
            <p className="mb-0 fs-5">{t('servicePage.noData', 'Aucun service trouvé')}</p>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default RenderServiceMobileCards;

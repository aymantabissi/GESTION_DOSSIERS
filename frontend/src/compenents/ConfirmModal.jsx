import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

const ConfirmModal = ({ show, title, message, onConfirm, onCancel }) => {
  const { t, i18n } = useTranslation();
  
  // Check if current language is RTL
  const isRTL = i18n.language === 'ar';
  
  // Apply RTL styles if needed
  const modalStyle = isRTL ? { textAlign: 'right', direction: 'rtl' } : {};
  const footerStyle = isRTL ? { justifyContent: 'flex-start' } : {};

  return (
    <Modal 
      show={show} 
      onHide={onCancel} 
      centered
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <Modal.Header closeButton style={modalStyle}>
        <Modal.Title>{title || t('confirmModal.title', 'Confirmation')}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={modalStyle}>
        <p>{message || t('confirmModal.message', 'Are you sure you want to proceed?')}</p>
        <small className="text-warning">
          {t('confirmModal.warning', 'This action cannot be undone.')}
        </small>
      </Modal.Body>
      <Modal.Footer style={{...modalStyle, ...footerStyle}}>
        <Button variant="secondary" onClick={onCancel}>
          {t('confirmModal.cancel', 'Cancel')}
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {t('confirmModal.confirm', 'Delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
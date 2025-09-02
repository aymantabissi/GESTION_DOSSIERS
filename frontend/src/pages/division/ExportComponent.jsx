// src/components/ExportComponent.jsx
import React, { useState } from 'react';
import { Button, ButtonGroup, Dropdown, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const ExportComponent = ({ 
  onExportPDF, 
  onExportCSV, 
  darkMode = false,
  size = "sm",
  variant = "outline-secondary",
  showLabel = true,
  disabled = false,
  className = ""
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState(null);
  const { t } = useTranslation();

  const handleExport = async (exportFunction, type, successMessage) => {
    if (disabled || isExporting) return;
    
    setIsExporting(true);
    setExportType(type);
    
    try {
      await exportFunction();
      toast.success(successMessage || t('export.success', 'Export réussi'));
    } catch (error) {
      console.error(`Export ${type} error:`, error);
      toast.error(error.message || t('export.error', 'Erreur lors de l\'export'));
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const buttonVariant = darkMode ? 
    (variant === "outline-secondary" ? "outline-light" : variant) : 
    variant;

  return (
    <Dropdown as={ButtonGroup} className={className}>
      <Button
        variant={buttonVariant}
        size={size}
        disabled={disabled || isExporting}
        onClick={() => handleExport(
          onExportPDF, 
          'PDF', 
          t('export.pdfSuccess', 'PDF exporté avec succès')
        )}
        className="d-flex align-items-center"
      >
        {isExporting && exportType === 'PDF' ? (
          <Spinner size="sm" className="me-1" />
        ) : (
          <i className="fas fa-file-pdf me-1" style={{ color: '#dc3545' }}></i>
        )}
        {showLabel && (
          <span className="d-none d-md-inline">
            {isExporting && exportType === 'PDF' ? 
              t('export.exporting', 'Export...') : 
              'PDF'
            }
          </span>
        )}
      </Button>

      <Dropdown.Toggle 
        split 
        variant={buttonVariant} 
        size={size}
        disabled={disabled || isExporting}
        id="export-dropdown"
      />

      <Dropdown.Menu className={darkMode ? "dropdown-menu-dark" : ""}>
        <Dropdown.Item 
          onClick={() => handleExport(
            onExportPDF, 
            'PDF', 
            t('export.pdfSuccess', 'PDF exporté avec succès')
          )}
          disabled={isExporting}
          className="d-flex align-items-center"
        >
          {isExporting && exportType === 'PDF' ? (
            <Spinner size="sm" className="me-2" />
          ) : (
            <i className="fas fa-file-pdf me-2" style={{ color: '#dc3545' }}></i>
          )}
          {t('export.exportPDF', 'Exporter en PDF')}
        </Dropdown.Item>
        
        <Dropdown.Item 
          onClick={() => handleExport(
            onExportCSV, 
            'CSV', 
            t('export.csvSuccess', 'CSV exporté avec succès')
          )}
          disabled={isExporting}
          className="d-flex align-items-center"
        >
          {isExporting && exportType === 'CSV' ? (
            <Spinner size="sm" className="me-2" />
          ) : (
            <i className="fas fa-file-csv me-2" style={{ color: '#28a745' }}></i>
          )}
          {t('export.exportCSV', 'Exporter en CSV')}
        </Dropdown.Item>
        
        <Dropdown.Divider />
        
        <Dropdown.Header className="small">
          {t('export.formats', 'Formats disponibles')}
        </Dropdown.Header>
        
        <Dropdown.ItemText className="small text-muted">
          <div className="d-flex justify-content-between">
            <span>PDF:</span>
            <span>{t('export.pdfDesc', 'Mise en forme')}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>CSV:</span>
            <span>{t('export.csvDesc', 'Données brutes')}</span>
          </div>
        </Dropdown.ItemText>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ExportComponent;
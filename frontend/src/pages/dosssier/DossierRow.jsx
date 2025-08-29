import React from 'react';
import { Form, Badge, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash, FaClock, FaExclamationTriangle, FaCheck, FaCog } from 'react-icons/fa';
import StatusBadge from './StatusBadge ';
import { Dropdown } from 'react-bootstrap';
import InstructionsDropdown from './InstructionsDropdown ';
import { useTranslation } from 'react-i18next';

const DossierRow = ({ dossier, selected, onSelect, onEdit, onDelete, onChangeEtat, darkMode, index }) => {
  const { t } = useTranslation();
  
  // Enhanced row styling with hover effects
  const tableRowClass = `
    ${darkMode ? '' : ''} 
    ${selected ? (darkMode ? 'table-active bg-primary bg-opacity-10' : 'table-active bg-primary bg-opacity-10') : ''}
    border-0
  `;
  
  const lastSituation = dossier.situations?.[0];

  // Enhanced badge styling
  const badgeBgDivision = darkMode ? 'outline-info' : 'info';
  const badgeBgService = darkMode ? 'outline-secondary' : 'secondary';

  // Tooltip components
  const renderTooltip = (text) => (
    <Tooltip>{text}</Tooltip>
  );

  return (
    <tr className={tableRowClass} style={{ 
      transition: 'all 0.2s ease',
      borderLeft: selected ? '4px solid var(--bs-primary)' : '4px solid transparent'
    }}>
      {/* Enhanced Checkbox */}
      <td className="ps-3">
        <Form.Check
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(dossier.num_dossier)}
          className="form-check-lg"
          style={{ transform: 'scale(1.1)' }}
        />
      </td>

      {/* Enhanced Intitulé dossier */}
      <td className="py-3">
        <div className="d-flex flex-column">
          <div className={`fw-bold text-capitalize lh-sm ${darkMode ? 'text-light' : 'text-dark'}`} 
               style={{ fontSize: '0.95rem' }}>
            {dossier.intitule_dossier}
          </div>
          <div className="d-flex align-items-center mt-1">
            <Badge bg={darkMode ? 'secondary' : 'light'} 
                   text={darkMode ? 'light' : 'dark'} 
                   className="rounded-pill px-2 py-1" 
                   style={{ fontSize: '0.7rem' }}>
              #{dossier.num_dossier}
            </Badge>
          </div>
        </div>
      </td>

      {/* Enhanced User */}
      <td className="py-3">
        <div className="d-flex align-items-center">
          <div className={`rounded-circle d-flex align-items-center justify-content-center me-2 ${
            darkMode ? 'bg-primary bg-opacity-25' : 'bg-primary bg-opacity-10'
          }`} style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
            {dossier.user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className={`fw-medium ${darkMode ? 'text-light' : 'text-dark'}`}>
            {dossier.user?.username || (
              <span className={darkMode ? 'text-light opacity-50' : 'text-muted'}>
                {t('userDropdown.user')}
              </span>
            )}
          </span>
        </div>
      </td>

      {/* Enhanced Division */}
      <td className="py-3">
        <Badge 
          bg={badgeBgDivision} 
          className="rounded-pill px-3 py-2 text-nowrap" 
          style={{ fontSize: '0.8rem', fontWeight: '500' }}
        >
          {dossier.division?.lib_division_fr || t('divisionPage.noData')}
        </Badge>
      </td>

      {/* Enhanced Service */}
      <td className="py-3">
        <Badge 
          bg={badgeBgService} 
          className="rounded-pill px-3 py-2 text-nowrap" 
          style={{ fontSize: '0.8rem', fontWeight: '500' }}
        >
          {dossier.service?.lib_service_fr || t('servicePage.form.unnamedDivision')}
        </Badge>
      </td>

      {/* Compact Date */}
      

      {/* Compact Instructions */}
      <td className="py-3">
        <InstructionsDropdown
          instructions={lastSituation?.dossierInstructions}
          darkMode={darkMode}
        />
      </td>

      {/* Enhanced État with better styling */}
      <td className="align-middle text-center py-3">
        <div className="d-flex flex-column align-items-center gap-2">
          {/* Status Badge */}
          <StatusBadge etat={lastSituation?.libelle_situation} darkMode={darkMode} />

          {/* Enhanced Dropdown Actions */}
          {lastSituation?.libelle_situation !== t('dashboard.termine') && (
            <Dropdown>
              <Dropdown.Toggle 
                variant={darkMode ? "outline-light" : "outline-secondary"} 
                size="sm"
                className={`btn-sm px-3 py-1 ${darkMode ? 'border-light border-opacity-25' : ''}`}
                style={{ fontSize: '0.75rem', borderRadius: '20px' }}
              >
                <FaCog className="me-1" style={{ fontSize: '0.7rem' }} />
                {t('dossierList.changerEtat')}
              </Dropdown.Toggle>

              <Dropdown.Menu 
                className={`${darkMode ? 'dropdown-menu-dark' : ''} border-0 shadow`}
                style={{ minWidth: '200px' }}
              >
                <Dropdown.Item 
                  onClick={() => onChangeEtat(dossier, t('dashboard.enCours'))}
                  className="d-flex align-items-center py-2"
                >
                  <div className="d-flex align-items-center justify-content-center me-3 bg-warning bg-opacity-25 rounded-circle" 
                       style={{ width: '24px', height: '24px' }}>
                    <FaClock className="text-warning" style={{ fontSize: '0.7rem' }} />
                  </div>
                  <span>{t('dashboard.enCours')}</span>
                </Dropdown.Item>
                
                <Dropdown.Item 
                  onClick={() => onChangeEtat(dossier, t('dashboard.enRetard'))}
                  className="d-flex align-items-center py-2"
                >
                  <div className="d-flex align-items-center justify-content-center me-3 bg-danger bg-opacity-25 rounded-circle" 
                       style={{ width: '24px', height: '24px' }}>
                    <FaExclamationTriangle className="text-danger" style={{ fontSize: '0.7rem' }} />
                  </div>
                  <span>{t('dashboard.enRetard')}</span>
                </Dropdown.Item>
                
                <Dropdown.Divider />
                
                <Dropdown.Item 
                  onClick={() => onChangeEtat(dossier, t('dashboard.termine'))}
                  className="d-flex align-items-center py-2"
                >
                  <div className="d-flex align-items-center justify-content-center me-3 bg-success bg-opacity-25 rounded-circle" 
                       style={{ width: '24px', height: '24px' }}>
                    <FaCheck className="text-success" style={{ fontSize: '0.7rem' }} />
                  </div>
                  <span>{t('dashboard.termine')}</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </td>

      {/* Compact Enhanced Actions */}
      <td className="py-3 pe-3">
        <div className="d-flex justify-content-center gap-1">
          <OverlayTrigger overlay={renderTooltip(t('dossierList.view'))}>
            <Button 
              as={Link} 
              to={`/dossiers/${dossier.num_dossier}/suivi`} 
              variant={darkMode ? "outline-info" : "info"} 
              size="sm"
              className="btn-icon d-flex align-items-center justify-content-center p-0"
              style={{ 
                width: '28px', 
                height: '28px', 
                borderRadius: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <FaEye style={{ fontSize: '0.7rem' }} />
            </Button>
          </OverlayTrigger>

          <OverlayTrigger overlay={renderTooltip(t('dossierList.edit'))}>
            <Button 
              variant={darkMode ? "outline-warning" : "warning"} 
              size="sm" 
              onClick={() => onEdit(dossier)}
              className="btn-icon d-flex align-items-center justify-content-center p-0"
              style={{ 
                width: '28px', 
                height: '28px', 
                borderRadius: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <FaEdit style={{ fontSize: '0.7rem' }} />
            </Button>
          </OverlayTrigger>

          <OverlayTrigger overlay={renderTooltip(t('dossierList.delete'))}>
            <Button 
              variant={darkMode ? "outline-danger" : "danger"} 
              size="sm" 
              onClick={() => onDelete(dossier.num_dossier)}
              className="btn-icon d-flex align-items-center justify-content-center p-0"
              style={{ 
                width: '28px', 
                height: '28px', 
                borderRadius: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <FaTrash style={{ fontSize: '0.7rem' }} />
            </Button>
          </OverlayTrigger>
        </div>
      </td>
    </tr>
  );
};

export default DossierRow;
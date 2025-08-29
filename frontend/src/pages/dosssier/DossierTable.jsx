import React from 'react';
import { Table, Card } from 'react-bootstrap';
import { FaFilter, FaInbox } from 'react-icons/fa';
import DossierRow from './DossierRow';
import DossierTableHeader from './DossierTableHeader ';
import { useTranslation } from 'react-i18next';

const DossierTable = ({ 
  dossiers, 
  selected, 
  loading, 
  darkMode,
  onSelectAll,
  onSelect,
  onEdit,
  onDelete,
  onChangeEtat,
  onSort 
}) => {
  const { t } = useTranslation();
  const selectedAll = selected.length === dossiers.length && dossiers.length > 0;
  
  // Enhanced table styling
  const tableClass = `table align-middle mb-0 table-hover border-0 ${
    darkMode ? 'table-dark' : 'table-light'
  }`;
  
  const colCount = 9;

  // Loading state with enhanced styling
  if (loading) {
    return (
      <Card className={`border-0 shadow-sm ${darkMode ? 'bg-dark' : 'bg-white'}`}>
        <div className="table-responsive">
          <Table className={tableClass}>
            <DossierTableHeader 
              selectedAll={false}
              onSelectAll={() => {}}
              onSort={onSort}
              darkMode={darkMode}
            />
            <tbody>
              <tr>
                <td colSpan={colCount} className="text-center py-5 border-0">
                  <div className="d-flex flex-column align-items-center justify-content-center py-4">
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                      <span className="visually-hidden">{t('loading')}</span>
                    </div>
                    <h6 className={`mb-2 ${darkMode ? 'text-light' : 'text-dark'}`}>
                      {t('loading')}...
                    </h6>
                    <p className={`mb-0 ${darkMode ? 'text-light opacity-75' : 'text-muted'}`}>
                      {t('dashboard.loadingDossiers')}
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Card>
    );
  }

  // Empty state with enhanced styling
  if (dossiers.length === 0) {
    return (
      <Card className={`border-0 shadow-sm ${darkMode ? 'bg-dark' : 'bg-white'}`}>
        <div className="table-responsive">
          <Table className={tableClass}>
            <DossierTableHeader 
              selectedAll={false}
              onSelectAll={() => {}}
              onSort={onSort}
              darkMode={darkMode}
            />
            <tbody>
              <tr>
                <td colSpan={colCount} className="text-center py-5 border-0">
                  <div className="d-flex flex-column align-items-center justify-content-center py-5">
                    <div className={`mb-4 p-4 rounded-circle ${
                      darkMode ? 'bg-secondary bg-opacity-25' : 'bg-light'
                    }`}>
                      <FaInbox 
                        size={48} 
                        className={darkMode ? 'text-light opacity-50' : 'text-muted opacity-75'} 
                      />
                    </div>
                    <h5 className={`mb-3 ${darkMode ? 'text-light' : 'text-dark'}`}>
                      {t('dashboard.aucunDossier')}
                    </h5>
                    <p className={`mb-3 ${darkMode ? 'text-light opacity-75' : 'text-muted'}`}>
                      {t('dashboard.trySearch')}
                    </p>
                    <div className="d-flex gap-2 flex-wrap justify-content-center">
                      <span className={`badge ${darkMode ? 'bg-secondary' : 'bg-light text-dark'} px-3 py-2`}>
                        <FaFilter className="me-1" />
                        {t('dashboard.tryFilters')}
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Card>
    );
  }

  // Main table with enhanced styling
  return (
    <Card className={`border-0 shadow-sm ${darkMode ? 'bg-dark' : 'bg-white'}`}>
      <div className="table-responsive">
        <Table className={tableClass} style={{ fontSize: '0.9rem' }}>
          <DossierTableHeader 
            selectedAll={selectedAll}
            onSelectAll={onSelectAll}
            onSort={onSort}
            darkMode={darkMode}
          />
          <tbody>
            {dossiers.map((dossier, index) => (
              <DossierRow
                key={dossier.num_dossier}
                dossier={dossier}
                selected={selected.includes(dossier.num_dossier)}
                onSelect={onSelect}
                onEdit={onEdit}
                onDelete={onDelete}
                onChangeEtat={onChangeEtat}
                darkMode={darkMode}
                index={index}
              />
            ))}
          </tbody>
        </Table>
      </div>
      
      {/* Optional: Table footer with summary */}
      <div className={`px-3 py-2 border-top ${darkMode ? 'bg-dark border-secondary' : 'bg-light border-light'}`}>
        <small className={`${darkMode ? 'text-light opacity-75' : 'text-muted'}`}>
          {t('dashboard.showing')} {dossiers.length} {t('dashboard.dossiers')}
          {selected.length > 0 && (
            <span className="ms-2">
              • {selected.length} {t('dashboard.selected')}
            </span>
          )}
        </small>
      </div>
    </Card>
  );
};

export default DossierTable;
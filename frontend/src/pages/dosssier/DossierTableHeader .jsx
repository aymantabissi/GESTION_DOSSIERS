import React from 'react';
import { Form } from 'react-bootstrap';
import { FaChevronDown, FaSort } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const DossierTableHeader = ({ selectedAll, onSelectAll, onSort, darkMode }) => {
  const { t } = useTranslation();
  
  // Enhanced header styling
  const theadClass = `${darkMode ? 'table-dark' : 'table-light'} border-0`;

  const SortableHeader = ({ children, sortKey, className = "" }) => (
    <th className={className}>
      <div className="d-flex align-items-center cursor-pointer user-select-none" 
           onClick={() => onSort(sortKey)}
           style={{ gap: '4px' }}>
        <span className="fw-semibold">{children}</span>
        <FaSort 
          size={10} 
          className={`opacity-75 ${darkMode ? 'text-light' : 'text-muted'}`}
          style={{ transition: 'all 0.2s ease' }}
        />
      </div>
    </th>
  );

  return (
    <thead className={theadClass} style={{ fontSize: '0.85rem' }}>
      <tr>
        {/* Checkbox Column - Compact */}
        <th style={{ width: '40px', paddingRight: '8px' }} className="ps-3">
          <Form.Check
            type="checkbox"
            onChange={onSelectAll}
            checked={selectedAll}
            style={{ transform: 'scale(1.1)' }}
          />
        </th>

        {/* Intitulé Column - Wider for content */}
        <SortableHeader sortKey="intitule_dossier" className="py-3" style={{ minWidth: '200px' }}>
          {t('dossierList.intitule')}
        </SortableHeader>

        {/* User Column - Compact */}
        <th className="py-3" style={{ width: '120px' }}>
          <span className="fw-semibold">{t('dossierList.creePar')}</span>
        </th>

        {/* Division Column - Compact */}
        <th className="py-3" style={{ width: '140px' }}>
          <span className="fw-semibold">{t('dossierList.division')}</span>
        </th>

        {/* Service Column - Compact */}
        <th className="py-3" style={{ width: '140px' }}>
          <span className="fw-semibold">{t('dossierList.service')}</span>
        </th>


       

        {/* Instructions Column - Compact */}
        <th className="py-3" style={{ width: '100px' }}>
          <span className="fw-semibold">{t('dossierList.instructions')}</span>
        </th>

        {/* État Column - Wider for dropdown */}
        <th className="text-center py-3" style={{ width: '160px' }}>
          <span className="fw-semibold">{t('dossierList.etat')}</span>
        </th>

        {/* Actions Column - Compact but adequate for 3 buttons */}
        <th className="text-center py-3 pe-3" style={{ width: '110px' }}>
          <span className="fw-semibold">{t('dossierList.actions')}</span>
        </th>
      </tr>
    </thead>
  );
};

export default DossierTableHeader;
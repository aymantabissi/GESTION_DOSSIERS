import React from 'react';
import { Form, InputGroup, Alert, Badge } from 'react-bootstrap';
import { FaFileAlt, FaCheckCircle, FaSearch } from 'react-icons/fa';
     import { useTranslation } from 'react-i18next';


const DossierSelector = ({
  dossiers,
  filteredDossiers,
  dossierId,
  setDossierId,
  dossierSearch,
  setDossierSearch,
  selectedDossier,
  themeClasses
}) => {

         const { t } = useTranslation();
    
  return (
   <div className="mb-4">
      <Form.Label className="fw-semibold mb-3">
        <FaFileAlt className="me-2 text-primary" />
        {t('form.selectDossier')}
      </Form.Label>
      
      <InputGroup className="mb-3">
        <InputGroup.Text className={themeClasses.inputClass}><FaSearch /></InputGroup.Text>
        <Form.Control
          type="text"
          placeholder={t('form.searchDossier')}
          value={dossierSearch}
          onChange={(e) => setDossierSearch(e.target.value)}
          className={themeClasses.inputClass}
        />
      </InputGroup>

      <Form.Select
        value={dossierId}
        onChange={(e) => setDossierId(e.target.value)}
        className={`${themeClasses.selectClass} ${dossierId ? 'border-success' : ''}`}
        size="lg"
      >
        <option value="">{t('form.chooseDossier')}</option>
        {filteredDossiers.map(d => (
          <option key={d.num_dossier} value={d.num_dossier}>
            #{d.num_dossier} - {d.intitule_dossier}
          </option>
        ))}
      </Form.Select>

      {selectedDossier && (
        <Alert variant="info" className="mt-3 border-0">
          <div className="d-flex align-items-start">
            <FaCheckCircle className="text-success me-2 mt-1" />
            <div className="flex-grow-1">
              <strong>{t('stats.selectedDossier')}</strong>
              <div className="mt-2">
                <Badge bg="primary" className="me-2">#{selectedDossier.num_dossier}</Badge>
                <span>{selectedDossier.intitule_dossier}</span>
              </div>
            </div>
          </div>
        </Alert>
      )}
    </div>
  );
};

export default DossierSelector;

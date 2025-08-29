import React from 'react';
import { Row, Col, InputGroup, Form, Button } from 'react-bootstrap';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';


const SearchFilterBar = ({ 
  searchTerm, 
  onSearchChange, 
  filterStatus, 
  onFilterChange, 
  onReset, 
  darkMode 
}) => {

    const { t } = useTranslation();
  

  // Classes ديال dark mode
  const inputClass = darkMode ? 'bg-dark text-light border-secondary' : '';
  const selectClass = darkMode ? 'bg-dark text-light border-secondary' : '';
  const btnClass = darkMode ? 'btn-outline-light' : 'btn-outline-secondary';

  return (
    <Row className="mb-4 g-3">
      <Col md={6}>
        <InputGroup>
          <InputGroup.Text className={inputClass}>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder={t('dossierList.recherch')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={inputClass}
          />
        </InputGroup>
      </Col>
      <Col md={3}>
        <Form.Select
  value={filterStatus}
  onChange={(e) => onFilterChange(e.target.value)}
  className={selectClass}
>
  <option value="all">{t('dossierList.lesstatuts')}</option>
  <option value="new">{t('dossierList.enCours')}</option>
  <option value="progress">{t('dossierList.enRetard')}</option>
  <option value="completed">{t('dossierList.termine')}</option>
</Form.Select>
      </Col>
      <Col md={3} className="d-flex justify-content-end">
        <Button 
  variant={btnClass} 
  onClick={onReset} 
  className="d-flex align-items-center"
>
  <FaFilter className="me-1" /> {t('dossierList.Réinitialiser')}
</Button>
      </Col>
    </Row>
  );
};

export default SearchFilterBar;

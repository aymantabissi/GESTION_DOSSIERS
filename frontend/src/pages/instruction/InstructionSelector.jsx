import React from 'react';
import { Form, InputGroup, Button, Row, Col } from 'react-bootstrap';
import { FaTasks, FaSearch, FaPlus } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const InstructionSelector = ({
  instructions,
  filteredInstructions,
  currentInstructionId,
  setCurrentInstructionId,
  instructionSearch,
  setInstructionSearch,
  handleAddInstruction,
  themeClasses
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Label className="fw-semibold mb-0">
          <FaTasks className="me-2 text-success" />
          {t('instructions.manage')}
        </Form.Label>
      </div>

      <InputGroup className="mb-3">
        <InputGroup.Text className={themeClasses.inputClass}>
          <FaSearch />
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder={t('instructions.searchPlaceholder')}
          value={instructionSearch}
          onChange={(e) => setInstructionSearch(e.target.value)}
          className={themeClasses.inputClass}
        />
      </InputGroup>

      <Row>
        <Col sm={8}>
          <Form.Select
            value={currentInstructionId}
            onChange={(e) => setCurrentInstructionId(e.target.value)}
            className={themeClasses.selectClass}
            size="lg"
          >
            <option value="">{t('instructions.chooseExisting')}</option>
            {filteredInstructions.map(i => (
              <option key={i.id_instruction} value={i.id_instruction}>
                {i.libelle_instruction}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col sm={4}>
          <Button
            type="button"
            variant="success"
            size="lg"
            className="w-100"
            onClick={handleAddInstruction}
            disabled={!currentInstructionId}
          >
            <FaPlus className="me-1" /> {t('instructions.add')}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default InstructionSelector;

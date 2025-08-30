import React from 'react';
import { Dropdown, Badge } from 'react-bootstrap';

const InstructionsDropdown = ({ instructions, darkMode }) => {
  const badgeBg = darkMode ? 'secondary' : 'secondary';

  if (!instructions || instructions.length === 0) {
    return <Badge bg={badgeBg} className="rounded-pill">Aucune instruction</Badge>;
  }

  return (
    <Dropdown>
      <Dropdown.Toggle 
        variant="link" 
        size="sm" 
        className={`p-0 text-decoration-none ${darkMode ? 'text-light' : ''}`}
      >
        {instructions.length} instruction(s)
      </Dropdown.Toggle>
      <Dropdown.Menu style={{ backgroundColor: darkMode ? '#2a2a2a' : '#fff', color: darkMode ? '#fff' : '#000' }}>
        {instructions.map((di, index) => (
          <Dropdown.Item 
            key={di.num_dossier_instruction || di.id || index} 
            style={{ backgroundColor: darkMode ? '#2a2a2a' : '#fff', color: darkMode ? '#fff' : '#000' }}
          >
            <div>
              <div>{di.instruction?.libelle_instruction}</div>
              <small className="text-muted">
                Par: {di.instruction?.user?.username || 'Non défini'}
              </small>
            </div>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default InstructionsDropdown;
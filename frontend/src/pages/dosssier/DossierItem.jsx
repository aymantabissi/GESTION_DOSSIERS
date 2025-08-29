import React from 'react';
import { Button } from 'react-bootstrap';

const DossierItem = ({ dossier, onEdit, onDelete, darkMode }) => {
  const rowStyle = {
    backgroundColor: darkMode ? '#1a1a1a' : '#fff',
    color: darkMode ? '#fff' : '#000',
  };

  const btnWarning = darkMode ? 'outline-warning' : 'warning';
  const btnDanger = darkMode ? 'outline-danger' : 'danger';

  return (
    <tr style={rowStyle} 
        onMouseEnter={e => e.currentTarget.style.backgroundColor = darkMode ? '#333' : '#f1f1f1'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = rowStyle.backgroundColor}>
      <td>{dossier.num_dossier}</td>
      <td>{dossier.intitule_dossier}</td>
      <td>{dossier.division?.name || '-'}</td>
      <td>{dossier.service?.name || '-'}</td>
      <td>{dossier.user?.username || '-'}</td>
      <td>
        <Button variant={btnWarning} size="sm" onClick={() => onEdit(dossier)}>Modifier</Button>{' '}
        <Button variant={btnDanger} size="sm" onClick={() => onDelete(dossier.num_dossier)}>Supprimer</Button>
      </td>
    </tr>
  );
};

export default DossierItem;

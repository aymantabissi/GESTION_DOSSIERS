import React from 'react';
import { Badge } from 'react-bootstrap';

const StatusBadge = ({ etat, darkMode }) => {
  let bgClass = 'secondary';
  let text = etat || 'Inconnu';

  if (etat) {
    const normalizedEtat = etat.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // remove accents
    switch (normalizedEtat) {
      case 'nouveau':
      case 'dossier cree':
      case 'dossier créé':
        bgClass = 'info';
        text = 'Nouveau';
        break;
      case 'en cours':
        bgClass = 'warning';
        text = 'En cours';
        break;
      case 'termine':
      case 'terminé':
        bgClass = 'success';
        text = 'Terminé';
        break;
      case 'en retard':      // <-- tout en minuscules
    bgClass = 'danger';
    text = 'En retard';
    break;
      case 'cloture':
      case 'clôturé':
        bgClass = 'dark';
        text = 'Clôturé';
        break;
      default:
        bgClass = 'primary';
    }
  }

  const textClass = darkMode && bgClass !== 'dark' ? 'text-dark' : 'text-light';

  return (
    <Badge bg={bgClass} className={`rounded-pill px-2 ${textClass}`}>
      {text}
    </Badge>
  );
};

export default StatusBadge;

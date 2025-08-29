// pages/DossierInstructionsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const DossierInstructionsPage = () => {
  const { num_dossier } = useParams();
  const [instructions, setInstructions] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/dossiers/${num_dossier}/instructions`)
      .then((res) => {
        setInstructions(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [num_dossier]);

  return (
    <div className="container mt-4">
      <h2>📌 Instructions du Dossier {num_dossier}</h2>
      {instructions.length > 0 ? (
        <ul className="list-group mt-3">
          {instructions.map((inst) => (
            <li key={inst.num_instruction} className="list-group-item">
              {inst.contenu_instruction}
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune instruction trouvée.</p>
      )}
    </div>
  );
};

export default DossierInstructionsPage;

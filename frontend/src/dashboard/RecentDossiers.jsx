import React, { useEffect, useState } from "react";
import { Card, Table, Spinner } from "react-bootstrap";
import { getDossiers } from "../api/dossierApi";

const RecentDossiers = () => {
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentDossiers = async () => {
      try {
        const data = await getDossiers();
        setDossiers(data.slice(0, 5)); // غير آخر 5
      } catch (err) {
        console.error("Erreur lors du chargement des dossiers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentDossiers();
  }, []);

  return (
    <Card className="mt-4 shadow-sm">
      <Card.Header className="bg-primary text-white">Derniers Dossiers</Card.Header>
      <Card.Body>
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Intitulé</th>
                <th>Division</th>
                <th>Service</th>
              </tr>
            </thead>
            <tbody>
              {dossiers.map((dossier, index) => (
                <tr key={dossier.id_dossier}>
                  <td>{index + 1}</td>
                  <td>{dossier.intitule_dossier}</td>
                  <td>{dossier.Division?.lib_division_fr || "-"}</td>
                  <td>{dossier.Service?.lib_service_fr || "-"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

export default RecentDossiers;

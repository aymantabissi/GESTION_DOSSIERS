import React, { useEffect, useState } from 'react';
import { Table, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { getSuiviDossier } from '../../api/dossierApi';
import { useTranslation } from 'react-i18next';

const SuiviDossier = ({ darkMode }) => {
  const { id } = useParams();
  const [suivi, setSuivi] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(); // i18n

  useEffect(() => {
    const fetchSuivi = async () => {
      try {
        const data = await getSuiviDossier(id);
        setSuivi(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSuivi();
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-4">
        <Spinner animation="border" />
      </div>
    );

  return (
    <div className="container mt-4" dir={t('dir')}>
      <h3>
        📋 {t('suivi.title')} #{id}
      </h3>
      {suivi.length === 0 ? (
        <p>{t('suivi.noSituation')}</p>
      ) : (
        <Table
          striped
          bordered
          hover
          className={darkMode ? 'table-dark' : ''}
        >
          <thead>
            <tr>
              <th>{t('suivi.date')}</th>
              <th>{t('suivi.libelle')}</th>
              <th>{t('suivi.observation')}</th>
              <th>{t('suivi.instructions')}</th>
            </tr>
          </thead>
          <tbody>
            {suivi.map((situation) => (
              <tr key={situation.num_situation}>
                <td>{new Date(situation.date_situation).toLocaleString()}</td>
                <td>{situation.libelle_situation}</td>
                <td>{situation.observation_situation}</td>
                <td>
                  {situation.dossierInstructions.length === 0
                    ? t('suivi.none')
                    : situation.dossierInstructions.map((di) => (
                        <div key={di.num_instruction}>
                          {di.instruction?.libelle_instruction || '—'}
                        </div>
                      ))}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default SuiviDossier;

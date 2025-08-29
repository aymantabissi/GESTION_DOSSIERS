import React, { useState, useEffect } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import { createDossier, updateDossier, getDivisions, getServices } from '../../api/dossierApi';

const DossierForm = ({ dossier, onSuccess, darkMode }) => {
  const { t, i18n } = useTranslation(); // Initialize translation hook
  const currentLanguage = i18n.language; // Get current language (e.g., 'ar', 'fr')
  const isRTL = currentLanguage === 'ar'; // Check if the language is RTL

  const [intitule, setIntitule] = useState(dossier?.intitule_dossier || '');
  const [idDivision, setIdDivision] = useState(dossier?.id_division || '');
  const [idService, setIdService] = useState(dossier?.id_service || '');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const [divisions, setDivisions] = useState([]);
  const [services, setServices] = useState([]);

  const inputBg = darkMode ? '#2a2a2a' : '#fff';
  const inputBorder = darkMode ? '#444' : '#ced4da';
  const inputText = darkMode ? '#fff' : '#000';
  const formBg = darkMode ? '#1f1f1f' : '#fff';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const divRes = await getDivisions();
        setDivisions(Array.isArray(divRes) ? divRes : []);

        const srvRes = await getServices();
        setServices(Array.isArray(srvRes) ? srvRes : []);
      } catch (err) {
        toast.error(t('errors.loadData') + ': ' + (err.response?.data?.message || err.message));
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, [t]); // Add t to dependency array

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!intitule || !idDivision) {
      toast.error(t('warnings.requiredFields'));
      setLoading(false);
      return;
    }

    try {
      const dossierData = {
        intitule_dossier: intitule,
        id_division: Number(idDivision),
        id_service: idService ? Number(idService) : null,
      };

      if (dossier) {
        await updateDossier(dossier.num_dossier, dossierData);
        toast.success(t('dossier.updated')); // You might want to add this to your translation file
      } else {
        await createDossier(dossierData);
        toast.success(t('dossier.created')); // You might want to add this to your translation file
      }

      onSuccess();
    } catch (err) {
      toast.error(t('errors.saveError') + ': ' + (err.response?.data?.message || 'Problème serveur'));
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="text-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <Spinner animation="border" />
        <div className="mt-2 text-muted">{t('loading')}</div> {/* Add a 'loading' key to your translation file */}
      </div>
    );
  }

  return (
    <Form onSubmit={handleSubmit} style={{ backgroundColor: formBg, padding: '20px', borderRadius: '0.375rem' }} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Form Groups */}
      <Form.Group className="mb-3">
        <Form.Label>{t('dossierForm.intitule')}</Form.Label> {/* Add this key */}
        <Form.Control
          type="text"
          value={intitule}
          onChange={e => setIntitule(e.target.value)}
          placeholder={t('dossierForm.intitulePlaceholder')}
          required
          style={{ backgroundColor: inputBg, borderColor: inputBorder, color: inputText }}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>{t('division')}</Form.Label> {/* Uses existing key from your file */}
        <Form.Select
          value={idDivision}
          onChange={e => { setIdDivision(e.target.value); setIdService(''); }}
          required
          style={{ backgroundColor: inputBg, borderColor: inputBorder, color: inputText }}
        >
          <option value="">-- {t('dossierForm.chooseDivision')} --</option> {/* Add this key */}
          {divisions.map(d => (
            <option key={d.id_division || d.id} value={d.id_division || d.id}>
              {d.lib_division_fr || d.nom_division || t('divisionPage.form.unnamedDivision')}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>{t('dossierForm.serviceLabel')} ({t('optional')})</Form.Label> {/* Add these keys */}
        <Form.Select
          value={idService}
          onChange={e => setIdService(e.target.value)}
          disabled={!idDivision}
          style={{ backgroundColor: inputBg, borderColor: inputBorder, color: inputText }}
        >
          <option value="">-- {t('dossierForm.chooseService')} --</option> {/* Add this key */}
          {services.filter(s => s.id_division === Number(idDivision) || s.divisionId === Number(idDivision))
            .map(s => (
              <option key={s.id_service || s.id} value={s.id_service || s.id}>
                {s.lib_service_fr || s.nom_service || t('servicePage.form.unnamedService')} {/* You might want to add 'unnamedService' */}
              </option>
            ))
          }
        </Form.Select>
      </Form.Group>

      <div className="d-flex justify-content-between">
        <Button variant={darkMode ? 'secondary' : 'outline-secondary'} onClick={() => onSuccess()} disabled={loading}>
          {t('cancel')} {/* Uses existing key from your file (e.g., in buttons.cancel) */}
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" className={isRTL ? "ms-2" : "me-2"} /> : null}
          {dossier ? t('modify') : t('create')} {/* Add these keys (e.g., 'modify' and 'create') */}
        </Button>
      </div>
    </Form>
  );
};

export default DossierForm;
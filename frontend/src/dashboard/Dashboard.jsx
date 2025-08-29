import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, AlertTriangle, CheckCircle, Clock, FileText, TrendingUp, Search } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';
import { Modal, Button, Card, Form, Spinner, Table } from 'react-bootstrap';
import DossierForm from '../pages/dosssier/DossierForm';
import StatusBadge from '../pages/dosssier/StatusBadge ';
import StatsCards from './StatsCards';
import axiosInstance from '../utils/axiosInstance';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = ({ darkMode = true }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: { totalDossiers: 0, dossiersEnCours: 0, dossiersTraites: 0, dossiersEnRetard: 0 },
    repartition: { parDivision: {}, parService: {} },
    dossiersRecents: []
  });

  const [showModal, setShowModal] = useState(false);
  const [dossierToEdit, setDossierToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('tous');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
  try {
    setLoading(true);
    const res = await axiosInstance.get('/dashboard/stats'); // no double /api
    setDashboardData(res.data);
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};

  const refreshDashboard = () => fetchDashboard();

  if (loading) return (
    <div className={`text-center p-5 ${darkMode ? 'text-light' : ''}`}>
      <Spinner animation="border" variant={darkMode ? "light" : "primary"} />
      <div className="mt-2">{t('loading')}</div>
    </div>
  );
  
  if (error) return (
    <div className={`text-center p-5 ${darkMode ? 'text-light' : 'text-danger'}`}>
      {t('errors.saveError')}: {error}
    </div>
  );

  const filteredDossiers = dashboardData.dossiersRecents.filter(d =>
    (d.intitule_dossier.toLowerCase().includes(searchTerm.toLowerCase()) ||
     d.num_dossier.toString().includes(searchTerm.toLowerCase())) &&
    (filterStatus === 'tous' || (d.situations?.[d.situations.length - 1]?.libelle_situation || '').toLowerCase() === filterStatus)
  );

  const divisionChartData = Object.entries(dashboardData.repartition.parDivision).map(([name, value]) => ({ name, value }));
  const serviceChartData = Object.entries(dashboardData.repartition.parService).map(([name, value]) => ({ name, value }));

  const statKeys = [
    { key: 'totalDossiers', label: t('dashboard.statistiques.totalDossiers'), icon: <FileText size={40} />, color: '#007bff' },
    { key: 'dossiersEnCours', label: t('dashboard.statistiques.enCours'), icon: <Clock size={40} />, color: '#ffc107' },
    { key: 'dossiersTraites', label: t('dashboard.statistiques.termines'), icon: <CheckCircle size={40} />, color: '#28a745' },
    { key: 'dossiersEnRetard', label: t('dashboard.statistiques.enRetard'), icon: <AlertTriangle size={40} />, color: '#dc3545' }
  ];

  return (
    <div className={`container-fluid p-4 ${darkMode ? 'bg-dark text-light' : ''}`} style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0"><TrendingUp size={28} className="me-2" />{t('dashboard.tableauDeBord')}</h2>
        <Button variant="primary" onClick={() => { setDossierToEdit(null); setShowModal(true); }}>
          <Plus size={18} className="me-1" /> {t('dashboard.nouveauDossier')}
        </Button>
      </div>

      {/* Stat Cards */}
      <StatsCards statKeys={statKeys} stats={dashboardData.stats} darkMode={darkMode} />

      {/* Charts */}
      <div className="row mb-4">
        <div className="col-lg-6 mb-3">
          <Card 
            className="h-100 shadow" 
            style={{ backgroundColor: darkMode ? '#2c2c2c' : '#fff', border: darkMode ? '1px solid #444' : '1px solid #dee2e6' }}
          >
            <Card.Body>
              <h5 style={{ color: darkMode ? '#fff' : '#000' }}>{t('dashboard.repartition.division')}</h5>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={divisionChartData} dataKey="value" nameKey="name" outerRadius={80} label>
                    {divisionChartData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </div>
        <div className="col-lg-6 mb-3">
          <Card 
            className="h-100 shadow" 
            style={{ backgroundColor: darkMode ? '#2c2c2c' : '#fff', border: darkMode ? '1px solid #444' : '1px solid #dee2e6' }}
          >
            <Card.Body>
              <h5 style={{ color: darkMode ? '#fff' : '#000' }}>{t('dashboard.repartition.service')}</h5>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={serviceChartData}>
                  <XAxis dataKey="name" stroke={darkMode ? "#fff" : "#000"} />
                  <YAxis stroke={darkMode ? "#fff" : "#000"} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#2c2c2c' : '#fff',
                      border: darkMode ? '1px solid #444' : '1px solid #ccc',
                      color: darkMode ? '#fff' : '#000'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Recent Dossiers Table */}
      <Card className="mb-4 shadow" style={{ backgroundColor: darkMode ? '#2c2c2c' : '#fff', border: darkMode ? '1px solid #444' : '1px solid #dee2e6' }}>
        <Card.Header className="d-flex justify-content-between align-items-center" style={{ backgroundColor: darkMode ? '#1c1c1c' : '#f8f9fa', borderBottom: darkMode ? '1px solid #444' : '1px solid #dee2e6' }}>
          <h5 className="mb-0" style={{ color: darkMode ? '#fff' : '#000' }}>{t('dashboard.dossiersRecents')}</h5>
          <div className="d-flex gap-2">
            <div className="position-relative">
              <Form.Control
                type="text"
                placeholder={t('dashboard.rechercher')}
                style={{ width: 250, paddingLeft: '40px', backgroundColor: darkMode ? '#3c3c3c' : '#fff', border: darkMode ? '1px solid #555' : '1px solid #ced4da', color: darkMode ? '#fff' : '#000' }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ color: darkMode ? '#aaa' : '#6c757d' }} />
            </div>
            <Form.Select style={{ width: 150, backgroundColor: darkMode ? '#3c3c3c' : '#fff', border: darkMode ? '1px solid #555' : '1px solid #ced4da', color: darkMode ? '#fff' : '#000' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="tous">{t('dashboard.tousLesEtats')}</option>
              <option value="nouveau">{t('dashboard.nouveau')}</option>
              <option value="en cours">{t('dashboard.enCours')}</option>
              <option value="terminé">{t('dashboard.termine')}</option>
              <option value="en retard">{t('dashboard.enRetard')}</option>
            </Form.Select>
          </div>
        </Card.Header>
        <div className="table-responsive">
          <Table striped bordered hover variant={darkMode ? "dark" : ""} className="mb-0">
            <thead>
              <tr>
                <th>{t('dossierForm.numDossier') || 'N° Dossier'}</th>
                <th>{t('dossierForm.intitule')}</th>
                <th>{t('divisionPage.title')}</th>
                <th>{t('servicePage.title')}</th>
                <th>{t('dossierForm.dateCreation') || 'Date Création'}</th>
                <th>{t('dashboard.statistiques.enCours')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredDossiers.length
                ? filteredDossiers.map(d => {
                    const dernierEtat = d.situations?.[d.situations.length - 1]?.libelle_situation || '-';
                    return (
                      <tr key={d.num_dossier}>
                        <td>{d.num_dossier}</td>
                        <td>{d.intitule_dossier}</td>
                        <td>{d.division?.lib_division_fr || '-'}</td>
                        <td>{d.service?.lib_service_fr || '-'}</td>
                        <td>{new Date(d.date_creation).toLocaleDateString('fr-FR')}</td>
                        <td><StatusBadge etat={dernierEtat} darkMode={darkMode} /></td>
                      </tr>
                    );
                  })
                : <tr><td colSpan="6" className="text-center">{t('dashboard.aucunDossier')}</td></tr>
              }
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" data-bs-theme={darkMode ? "dark" : ""}>
        <Modal.Header closeButton style={{ backgroundColor: darkMode ? '#2c2c2c' : '#fff', borderBottom: darkMode ? '1px solid #444' : '1px solid #dee2e6', color: darkMode ? '#fff' : '#000' }}>
          <Modal.Title>{dossierToEdit ? t('modify') : t('create')}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: darkMode ? '#2c2c2c' : '#fff' }}>
          <DossierForm dossier={dossierToEdit} onSuccess={() => { setShowModal(false); refreshDashboard(); }} darkMode={darkMode} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Dashboard;

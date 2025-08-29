// src/pages/UsersPage.jsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Spinner, Form,Card } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import UserForm from './UserForm';
import ConfirmModal from '../compenents/ConfirmModal';
import PaginationComponent from '../compenents/PaginationComponent';
import { useTranslation } from 'react-i18next';

const UsersPage = ({ darkMode = false }) => {
  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error(err.response?.data?.message || t('users.loadError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // 🔹 Filtered users
  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 Paginated users
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDeleteClick = (id_user) => {
    setDeleteId(id_user);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(t('users.deleted'));
      setShowConfirm(false);
      setDeleteId(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || t('users.serverError'));
    }
  };

  const tableHeaderBg = darkMode ? '#2c2c2c' : '#e9ecef';
  const tableBg = darkMode ? '#1c1c1c' : '#fff';
  const textColor = darkMode ? '#fff' : '#000';

  return (
    <div className={`${darkMode ? "bg-dark text-light" : ""} container-fluid py-4`} style={{ minHeight: "100vh" }} dir={t('dir')}>
      <Card.Header className="d-flex justify-content-between align-items-center">
         <h3 className="mb-0">{t('users.title', 'Gestion des Services')}</h3>
         <Button variant="primary" onClick={() => { setUserToEdit(null); setShowModal(true); }}>
                    {t('users.new', '+ Nouveau users')}
                  </Button>
     </Card.Header><br/>

      <Form.Control
        type="text"
        placeholder={t('users.searchPlaceholder', 'Recherche par nom ou email...')}
        value={searchTerm}
        onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        className="mb-3"
      />

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant={darkMode ? 'light' : 'primary'} />
        </div>
      ) : (
        <>
          <Table striped bordered hover variant={darkMode ? "dark" : ""} className="mb-0">
            <thead style={{ backgroundColor: tableHeaderBg, color: textColor }}>
              <tr>
                <th>{t('users.id')}</th>
                <th>{t('users.name')}</th>
                <th>{t('users.email')}</th>
                <th>{t('users.profile')}</th>
                <th>{t('users.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length ? paginatedUsers.map(u => (
                <tr key={u.id_user}>
                  <td>{u.id_user}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.id_profile}</td>
                  <td>
                    <Button size="sm" variant={darkMode ? 'outline-warning' : 'warning'} className="me-2" onClick={() => { setUserToEdit(u); setShowModal(true); }}>
                      {t('users.edit')}
                    </Button>
                    <Button size="sm" variant={darkMode ? 'outline-danger' : 'danger'} onClick={() => handleDeleteClick(u.id_user)}>
                      {t('users.delete')}
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="text-center">{t('users.none')}</td></tr>
              )}
            </tbody>
          </Table>

          <PaginationComponent
            totalItems={filteredUsers.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} data-bs-theme={darkMode ? "dark" : ""}>
        <Modal.Header closeButton style={{ backgroundColor: tableHeaderBg, color: textColor }}>
          <Modal.Title>{userToEdit ? t('users.edit') : t('users.new')}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: tableBg, color: textColor }}>
          <UserForm user={userToEdit} darkMode={darkMode} onSuccess={() => { setShowModal(false); fetchUsers(); }} />
        </Modal.Body>
      </Modal>

      <ConfirmModal
        show={showConfirm}
        title={t('users.confirmTitle')}
        message={t('users.confirmMessage')}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
        darkMode={darkMode}
      />
    </div>
  );
};

export default UsersPage;

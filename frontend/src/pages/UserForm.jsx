import React, { useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance'; // Import your configured axios instance
import { useTranslation } from 'react-i18next';

const UserForm = ({ user, onSuccess, darkMode = false }) => {
  const { t } = useTranslation();

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [idProfile, setIdProfile] = useState(user?.id_profile || '');
  const [loading, setLoading] = useState(false);

  const profiles = [
    { id: 1, name: t('users.profiles.admin') },
    { id: 2, name: t('users.profiles.chef') },
    { id: 3, name: t('users.profiles.fonctionnaire') },
    { id: 4, name: t('users.profiles.sg') },
    { id: 5, name: t('users.profiles.cabinet') }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { username, email, password: password || undefined, id_profile: idProfile };

      if (user) {
        await axiosInstance.put(`/users/${user.id_user}`, payload);
        toast.success(t('users.updated'));
      } else {
        await axiosInstance.post('/users', payload);
        toast.success(t('users.created'));
      }

      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || t('users.serverError'));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = darkMode ? 'bg-dark text-light border-secondary' : '';

  return (
    <Form onSubmit={handleSubmit} dir={t('dir')}>
      <Form.Group className="mb-3">
        <Form.Label>{t('users.username')}</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={inputClass}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>{t('users.email')}</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          required
        />
      </Form.Group>

      {!user && (
        <Form.Group className="mb-3">
          <Form.Label>{t('users.password')}</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            required
          />
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label>{t('users.profile')}</Form.Label>
        <Form.Select value={idProfile} onChange={(e) => setIdProfile(Number(e.target.value))} className={inputClass} required>
          <option value="">{t('users.selectProfile')}</option>
          {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </Form.Select>
      </Form.Group>

      <Button type="submit" disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : user ? t('users.edit') : t('users.new')}
      </Button>
    </Form>
  );
};

export default UserForm;
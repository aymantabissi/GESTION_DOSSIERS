import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        setUserData(user);
        setUsername(user.username);
      }
    };
    fetchUser();
  }, []);

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('username', username);
      if (password) formData.append('password', password);
      if (photo) formData.append('photo', photo);

      const token = localStorage.getItem('token');

      const res = await axios.put(
  `http://localhost:5000/api/users/${userData.id_user}`, 
  formData, 
  {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  }
);

      setUserData(res.data);
      setPassword('');
      setPhoto(null);
      localStorage.setItem('user', JSON.stringify(res.data));
      setMessage('Profile mis à jour avec succès!');
    } catch (err) {
      console.error(err);
      setMessage('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  if (!userData) return <Spinner animation="border" />;

  return (
    <Card className="mx-auto mt-5" style={{ maxWidth: '500px' }}>
      <Card.Body>
        <Card.Title>Mon Profil</Card.Title>
        {message && <Alert variant="info">{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={userData.email} disabled />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mot de passe (laisser vide si inchangé)</Form.Label>
            <Form.Control 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Photo de profil</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
           {userData.photo && (
  <img 
    src={`http://localhost:5000/uploads/${userData.photo}`} 
    alt="profile" 
    className="mt-2 rounded-circle" 
    width="80" 
    height="80" 
  />
)}
          </Form.Group>

          <Button type="submit" disabled={loading}>
            {loading ? 'Mise à jour...' : 'Mettre à jour'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ProfilePage;

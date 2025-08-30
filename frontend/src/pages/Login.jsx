import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import minster from '../assests/minester.jpeg';
import axiosInstance from '../utils/axiosInstance';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/users/login', { email, password });
      localStorage.setItem('token', res.data.token);
      if (res.data.user) localStorage.setItem('user', JSON.stringify(res.data.user));

      toast.success('Login successful!', { transition: Slide });
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      toast.error('Login failed: ' + (err.response?.data?.message || 'Server error'), { transition: Slide });
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: '#f0f2f5' }}>
      <ToastContainer />
      <div className="card shadow-lg rounded-4 w-100" style={{ maxWidth: '400px' }}>
        {/* Header */}
        <div className="card-header bg-primary text-white text-center py-3 rounded-top-4">
          <div className="d-flex justify-content-center mb-2">
            <div className="bg-white rounded-circle d-flex align-items-center justify-content-center"
                 style={{ width: '60px', height: '60px' }}>
              <img 
                src={minster} 
                alt="Logo" 
                style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Crect width='50' height='50' fill='%232c3e50'/%3E%3Ctext x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='8' fill='white'%3ELOGO%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
          </div>
          <h5 className="mb-0 fs-6 fs-md-5">Provincial Portal</h5>
        </div>

        {/* Body */}
        <div className="card-body p-3 p-md-4">
          <h6 className="card-title text-center mb-3">Secure Login</h6>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                placeholder="name@example.com"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                placeholder="Enter password"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
          <div className="text-center mt-3">
            <a href="#help" className="small text-decoration-none">Need help?</a>
          </div>
        </div>

        {/* Footer */}
        <div className="card-footer text-center py-2">
          <small className="text-muted">© {new Date().getFullYear()} Provincial Services</small>
        </div>
      </div>
    </div>
  );
};

export default Login;

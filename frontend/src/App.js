import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import SuiviDossier from './pages/dosssier/SuiviDossier';
import ProfilePage from './pages/ProfilePage';
import DivisionPage from './pages/division/DivisionPage';
import UsersPage from './pages/UsersPage';
import DossiersPage from './pages/DossiersPage';
import AddInstructionPage from './pages/instruction/AddInstructionPage';
import ServicePage from './service/ServicePage';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from './context/UserContext';
import PrivateRoute from './compenents/PrivateRoute';
import Layout from './compenents/layaout/Layout';
import Dashboard from './dashboard/Dashboard';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <Router>
      {/* Toast */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/*  Wrap all routes with UserProvider */}
      <UserProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <Dashboard darkMode={darkMode} />
                </Layout>
              </PrivateRoute>
            } 
          />

          <Route 
            path="/dossiers" 
            element={
              <PrivateRoute>
                <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <DossiersPage darkMode={darkMode} />
                </Layout>
              </PrivateRoute>
            } 
          />

          <Route
            path="/add-instruction"
            element={
              <PrivateRoute>
                <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <AddInstructionPage darkMode={darkMode} />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/dossiers/:id/suivi"
            element={
              <PrivateRoute>
                <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <SuiviDossier darkMode={darkMode} />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <ProfilePage darkMode={darkMode} />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/divisions"
            element={
              <PrivateRoute>
                <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <DivisionPage darkMode={darkMode} />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <Dashboard darkMode={darkMode} />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/services"
            element={
              <PrivateRoute>
                <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <ServicePage darkMode={darkMode} />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <UsersPage darkMode={darkMode} />
                </Layout>
              </PrivateRoute>
            }
          />

        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;

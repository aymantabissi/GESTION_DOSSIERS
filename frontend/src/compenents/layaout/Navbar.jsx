import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserDropdown from '../UserDropdown';
import { useTranslation } from "react-i18next";
import { FaBell, FaMoon, FaSun } from 'react-icons/fa';
import LanguageSwitcher from '../../langauge/LanguageSwitcher';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../../api/notificationApi';
import logoImage from '../../assests/minester.jpeg';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const getUserData = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setCurrentUser(parsedUser);
          return parsedUser;
        } catch (error) {
          localStorage.removeItem('user');
          setCurrentUser(null);
        }
      }
      return null;
    };
    getUserData();

    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        getUserData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const pageTitles = {
    "/dashboard": t("nav.dashboard"),
    "/dossiers": t("nav.dossiers"),
    "/users": t("nav.users"),
    "/add-instruction": t("nav.instructions"),
    "/reports": t("nav.reports"),
    "/divisions": t("nav.divisions"),
    "/services": t("nav.services"),
  };
  const pageTitle = pageTitles[location.pathname] || "";

  useEffect(() => {
    if (currentUser?.id_user) {
      const fetchAllNotifications = async () => {
        try {
          const res = await getNotifications(currentUser.id_user);
          setNotifications(res);
          setUnreadCount(res.filter(n => !n.is_read).length);
        } catch (err) {
          console.error('Error fetching notifications:', err);
        }
      };
      fetchAllNotifications();
    }
  }, [currentUser?.id_user]);

  const handleNotificationClick = (notif) => {
    if (!notif.is_read) {
      markNotificationRead(notif.id).then(() => {
        setNotifications(prev =>
          prev.map(n =>
            n.id === notif.id ? { ...n, is_read: true, read_at: new Date() } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      });
    }
    if (notif.dossier_id) {
      navigate(`/dossiers/${notif.dossier_id}/suivi`);
    } else if (notif.link) {
      if (/^\/dossiers\/\d+$/.test(notif.link)) {
        navigate(`${notif.link}/suivi`);
      } else {
        navigate(notif.link);
      }
    }
  };

  const handleCloseNotifications = async () => {
    if (unreadCount > 0 && currentUser?.id_user) {
      try {
        await markAllNotificationsRead(currentUser.id_user);
        setNotifications(prev =>
          prev.map(n =>
            !n.is_read ? { ...n, is_read: true, read_at: new Date() } : n
          )
        );
        setUnreadCount(0);
      } catch (err) {
        const unreadNotifications = notifications.filter(n => !n.is_read);
        await Promise.all(unreadNotifications.map(n => markNotificationRead(n.id)));
        setNotifications(prev =>
          prev.map(n =>
            !n.is_read ? { ...n, is_read: true, read_at: new Date() } : n
          )
        );
        setUnreadCount(0);
      }
    }
    setShowDropdown(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-white'} shadow-sm px-3`}
      style={{ height: '70px', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1050, direction: isRTL ? 'rtl' : 'ltr' }}>

      {/* Logo */}
      <a className="navbar-brand d-flex align-items-center" href="/dashboard">
        <img src={logoImage} alt="Logo"
          className="me-2"
          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ddd' }} />
      </a>

      {/* Page Title - Always centered */}
      <div className="position-absolute top-50 start-50 translate-middle text-center">
        <h5 className="mb-0 fw-bold">{pageTitle}</h5>
      </div>

      {/* Toggler for mobile */}
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarMain">
        {/* Right section */}
        <ul className="navbar-nav ms-auto d-flex align-items-center gap-2">
          {/* Notifications */}
          <li className="nav-item dropdown">
            <button className="btn p-2 position-relative" onClick={() => setShowDropdown(!showDropdown)}>
              <FaBell size={18} color={darkMode ? "white" : "black"} />
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                  {unreadCount}
                </span>
              )}
            </button>
            {showDropdown && (
              <div className="dropdown-menu dropdown-menu-end p-0 show" style={{ minWidth: '280px', maxHeight: '400px', overflowY: 'auto' }}>
                <div className="px-3 py-2 border-bottom d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Notifications</h6>
                  {unreadCount > 0 && (
                    <button className="btn btn-link btn-sm p-0 text-decoration-none" onClick={handleCloseNotifications}>
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="p-2">
                  {notifications.length === 0 ? (
                    <div className="text-center py-3"><span className="text-muted">No notifications</span></div>
                  ) : (
                    notifications.map(n => (
                      <button key={n.id}
                        className={`dropdown-item text-start mb-1 rounded ${!n.is_read ? 'bg-primary bg-opacity-10' : 'bg-light text-muted opacity-50'}`}
                        onClick={() => handleNotificationClick(n)}>
                        <div className="fw-semibold">{n.title || 'Notification'}</div>
                        <div style={{ fontSize: '0.8rem' }}>{n.message}</div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </li>

          {/* Language */}
          <li className="nav-item">
            <LanguageSwitcher />
          </li>

          {/* Dark Mode */}
          <li className="nav-item">
            <button className="btn p-2" onClick={toggleDarkMode}>
              {darkMode ? <FaSun size={18} color="white" /> : <FaMoon size={18} />}
            </button>
          </li>

          {/* User Dropdown */}
          <li className="nav-item">
            <UserDropdown currentUser={currentUser} onLogout={handleLogout} darkMode={darkMode} isRTL={isRTL} />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

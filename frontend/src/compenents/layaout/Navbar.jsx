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
          setNotifications(res.data);
          setUnreadCount(res.data.filter(n => !n.is_read).length);
        } catch (err) {
          console.error('Error fetching notifications:', err);
        }
      };

      fetchAllNotifications();
    }
  }, [currentUser?.id_user]);

const handleNotificationClick = (notif) => {
  // Mark notification as read if not already
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

  // Redirect based on type
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
    <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-white'} shadow-sm px-4`}
         style={{ height: '70px', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1050, direction: isRTL ? 'rtl' : 'ltr' }}>
      
      {/* Logo */}
      <div className="d-flex align-items-center" style={isRTL ? { marginLeft: 'auto' } : { marginRight: 'auto' }}>
        <img src={logoImage} alt="Logo" className={isRTL ? "ms-3" : "me-3"} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ddd' }} />
      </div>

      {/* Page Title */}
      <div className="position-absolute top-50 start-50 translate-middle" style={{ pointerEvents: 'none', [isRTL ? 'right' : 'left']: '50%', transform: 'translate(-50%, -50%)' }}>
        <h4 className="mb-0 fw-bold text-center">{pageTitle}</h4>
      </div>

      {/* Right Icons */}
      <div className={`d-flex align-items-center ${isRTL ? 'me-auto' : 'ms-auto'} gap-3`}>
        {/* Notifications */}
        <div className="position-relative">
          <button className="btn p-2" style={{ color: darkMode ? 'white' : 'black' }} onClick={() => setShowDropdown(!showDropdown)}>
            <FaBell size={18} />
            {unreadCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize:'0.6rem' }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showDropdown && (
            <>
              <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1040 }} onClick={handleCloseNotifications} />
              <div className={`dropdown-menu dropdown-menu-end p-0 show ${darkMode ? 'bg-dark' : ''}`} style={{ minWidth:'280px', maxHeight:'400px', overflowY:'auto', zIndex: 1050 }}>
                <div className={`px-3 py-2 border-bottom ${darkMode ? 'bg-secondary' : 'bg-light'}`}>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Notifications</h6>
                    {unreadCount > 0 && (
                      <button className="btn btn-link btn-sm p-0 text-decoration-none" onClick={handleCloseNotifications} style={{ fontSize: '0.8rem' }}>
                        Mark all as read
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-2">
                  {notifications.length === 0 ? (
                    <div className="text-center py-3"><span className="text-muted">No notifications</span></div>
                  ) : (
                    notifications.map(n => (
                      <button
    key={n.id}
    className={`dropdown-item text-start mb-1 rounded 
                ${darkMode ? 'text-white' : ''} 
                ${!n.is_read ? 'bg-primary bg-opacity-10' : 'bg-light text-muted opacity-50'}`}
    onClick={() => handleNotificationClick(n)}
    style={{ whiteSpace: 'normal', padding: '8px 12px', fontSize: '0.9rem', lineHeight: '1.3', position: 'relative', transition: 'all 0.3s ease' }}
  >
    {!n.is_read && <div className="position-absolute top-50 translate-middle-y bg-primary rounded-circle" style={{ left: '4px', width: '6px', height: '6px' }} />}
    <div className={`${!n.is_read ? 'ms-3' : ''}`}>
      <div className={`fw-semibold mb-1 ${!n.is_read ? 'fw-bold' : ''}`}>{n.title || 'Notification'}</div>
      <div className={`${!n.is_read ? 'text-dark' : 'text-muted'}`} style={{ fontSize: '0.8rem' }}>{n.message}</div>
      {n.created_at && <div className="text-muted mt-1" style={{ fontSize: '0.7rem' }}>{new Date(n.created_at).toLocaleDateString()}</div>}
    </div>
  </button>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <LanguageSwitcher />

        <button className="btn p-2" onClick={toggleDarkMode} style={{ color: darkMode ? 'white' : 'black' }}>
          {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
        </button>

        <UserDropdown currentUser={currentUser} onLogout={handleLogout} darkMode={darkMode} isRTL={isRTL} />
      </div>
    </nav>
  );
};

export default Navbar;

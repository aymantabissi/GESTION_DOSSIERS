import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { OverlayTrigger, Tooltip, Fade } from 'react-bootstrap';

const Sidebar = ({ isCollapsed: parentCollapsed, onToggle, darkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(parentCollapsed || false);
  const { i18n, t } = useTranslation();

  const isRTL = i18n.language === "ar";

  useEffect(() => {
    if (parentCollapsed !== undefined) {
      setIsCollapsed(parentCollapsed);
    }
  }, [parentCollapsed]);

  const menuItems = [
    { path: '/dashboard', icon: 'bi-speedometer2', label: t("nav.dashboard") },
    { path: '/dossiers', icon: 'bi-folder2', label: t("nav.dossiers") },
    { path: '/users', icon: 'bi-people', label: t("nav.users") },
    { path: '/add-instruction', icon: 'bi-journal-plus', label: t("nav.instructions") },
    { path: '/divisions', icon: 'bi-building', label: t("nav.divisions") },
    { path: '/services', icon: 'bi-gear', label: t("nav.services") },
  ];

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onToggle) onToggle(newState);
  };

  const sidebarBg = darkMode ? '#1f1f1f' : '#f8f9fa';
  const activeBg = '#0d6efd';
  const textColor = darkMode ? 'white' : 'black';

  return (
    <div
      className="d-flex flex-column shadow-lg"
      style={{
        width: isCollapsed ? '80px' : '220px',
        transition: 'width 0.3s ease',
        top: '70px',
        [isRTL ? "right" : "left"]: 0,
        height: 'calc(100vh - 70px)',
        position: 'fixed',
        zIndex: 1000,
        borderRight: !isRTL ? (darkMode ? '1px solid #444' : '1px solid #ddd') : "none",
        borderLeft: isRTL ? (darkMode ? '1px solid #444' : '1px solid #ddd') : "none",
        backgroundColor: sidebarBg,
        direction: isRTL ? "rtl" : "ltr",
        overflowY: "auto"
      }}
    >
      <nav className="flex-grow-1 p-2">
        <ul className="nav flex-column list-unstyled">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;

            const button = (
              <button
                className="btn w-100 d-flex align-items-center border-0 sidebar-btn"
                onClick={() => navigate(item.path)}
                style={{
                  padding: isCollapsed ? '0.5rem' : '0.75rem 1rem',
                  justifyContent: isCollapsed ? 'center' : (isRTL ? 'flex-end' : 'flex-start'),
                  backgroundColor: isActive ? activeBg : 'transparent',
                  color: isActive ? 'white' : textColor,
                  borderRadius: '0.5rem',
                  transition: 'all 0.2s',
                  position: "relative"
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <span
                    style={{
                      position: "absolute",
                      top: "10%",
                      bottom: "10%",
                      [isRTL ? "right" : "left"]: "0",
                      width: "4px",
                      borderRadius: "2px",
                      backgroundColor: "white"
                    }}
                  />
                )}

                <i className={`bi ${item.icon} fs-5 ${isCollapsed ? '' : (isRTL ? 'ms-3' : 'me-3')}`}></i>
                {!isCollapsed && <span className="fw-medium">{item.label}</span>}
              </button>
            );

            return (
              <li key={index} className="nav-item mb-1">
                {isCollapsed ? (
                  <OverlayTrigger
                    placement={isRTL ? "left" : "right"}
                    overlay={<Tooltip id={`tooltip-${index}`} transition={Fade}>{item.label}</Tooltip>}
                    delay={{ show: 100, hide: 50 }}
                  >
                    {button}
                  </OverlayTrigger>
                ) : button}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse button */}
      <div className="p-2 border-top" style={{ borderColor: darkMode ? '#444' : '#ddd' }}>
        <button
          className="btn w-100"
          onClick={toggleSidebar}
          style={{
            borderRadius: '0.5rem',
            backgroundColor: darkMode ? '#2a2a2a' : '#fff',
            color: textColor,
            border: darkMode ? '1px solid #444' : '1px solid #ccc',
            transition: 'all 0.3s'
          }}
        >
          {isCollapsed
            ? <i className={`bi ${isRTL ? "bi-chevron-double-left" : "bi-chevron-double-right"}`}></i>
            : <i className={`bi ${isRTL ? "bi-chevron-double-right" : "bi-chevron-double-left"}`}></i>
          }
        </button>
      </div>

      <style>{`
        .sidebar-btn:hover i {
          transform: scale(1.2);
          transition: transform 0.2s;
        }
        .sidebar-btn:hover span {
          color: ${activeBg};
          transition: color 0.2s;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;

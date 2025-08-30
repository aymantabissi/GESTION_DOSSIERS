import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useTranslation } from "react-i18next";

const Layout = ({
  children,
  pageTitle = "Gestion des Dossiers",
  darkMode: parentDarkMode = false,
  toggleDarkMode: parentToggleDarkMode
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const darkMode = parentDarkMode;
  const toggleDarkMode = parentToggleDarkMode;

  // Sidebar width values
  const sidebarWidth = sidebarCollapsed ? 80 : 220;

  return (
    <div
      className={darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}
      style={{
        minHeight: '100vh',
        direction: isRTL ? 'rtl' : 'ltr'
      }}
    >
      {/* Navbar */}
      <Navbar pageTitle={pageTitle} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <div className="d-flex" style={{ paddingTop: '70px' }}>
        {/* Sidebar */}
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={setSidebarCollapsed}
          darkMode={darkMode}
        />

        {/* Main Content */}
        <div
          className="flex-grow-1"
          style={{
            // Responsive margins
            marginLeft: !isRTL ? `${sidebarWidth}px` : '0px',
            marginRight: isRTL ? `${sidebarWidth}px` : '0px',
            transition: 'margin 0.3s ease',
            minHeight: 'calc(100vh - 70px)',
            backgroundColor: darkMode ? '#121212' : '#fff'
          }}
        >
          <main className="p-4">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;

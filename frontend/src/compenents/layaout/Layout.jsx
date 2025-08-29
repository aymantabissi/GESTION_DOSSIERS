import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useTranslation } from "react-i18next";

const Layout = ({ children, pageTitle = "Gestion des Dossiers", darkMode: parentDarkMode = false, toggleDarkMode: parentToggleDarkMode }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Dark mode كيجي من App.js باش يكون موحد لجميع الصفحات
  const darkMode = parentDarkMode;
  const toggleDarkMode = parentToggleDarkMode;

  return (
    <div 
      className={darkMode ? 'bg-dark text-light' : 'bg-light text-dark'} 
      style={{ 
        minHeight: '100vh',
        direction: isRTL ? 'rtl' : 'ltr'
      }}
    >
      {/* Navbar مع darkMode */}
      <Navbar pageTitle={pageTitle} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <div className="d-flex" style={{ paddingTop: '70px' }}>
        {/* Sidebar مع darkMode */}
        <Sidebar isCollapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} darkMode={darkMode} />

        <div
          className="flex-grow-1"
          style={{
            marginLeft: sidebarCollapsed ? '80px' : '220px',
            marginRight: isRTL ? (sidebarCollapsed ? '80px' : '220px') : '0px',
            transition: 'margin 0.3s ease',
            minHeight: 'calc(100vh - 70px)',
          }}
        >
          <main className="p-4">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
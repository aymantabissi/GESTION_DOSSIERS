import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const UserDropdown = ({ isCollapsed, currentUser, onLogout, darkMode = false, isRTL = false, onUserUpdate }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);

  const getUserData = () => {
    // Debug: Log all localStorage keys
    console.log('🔍 All localStorage keys:', Object.keys(localStorage));
    
    // Check currentUser prop first
    if (currentUser && Object.keys(currentUser).length > 0) {
      console.log('✅ Using currentUser from props:', currentUser);
      setUser(currentUser);
      return currentUser;
    }
    
    // Check localStorage
    const userData = localStorage.getItem('user');
    console.log('🔍 Raw userData from localStorage:', userData);
    
    if (userData && userData !== 'undefined' && userData !== 'null') {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('✅ Parsed user data:', parsedUser);
        
        if (parsedUser && typeof parsedUser === 'object') {
          setUser(parsedUser);
          return parsedUser;
        } else {
          console.log('❌ Parsed user data is not a valid object:', typeof parsedUser);
        }
      } catch (error) {
        console.error('❌ Error parsing localStorage user data:', error);
        localStorage.removeItem('user');
      }
    }
    
    console.log('❌ No valid user data found anywhere');
    setUser(null);
    return null;
  };

  // Initialize user data
  React.useEffect(() => {
    getUserData();
  }, [currentUser]);

  const handlePhotoUpload = async (file) => {
    if (!user) return;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      // Make API call to update user photo
      const response = await fetch(`http://localhost:5000/api/users/${user.id_user}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      const updatedUser = await response.json();
      console.log('✅ Photo updated successfully:', updatedUser);

      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update local state
      setUser(updatedUser);
      
      // Notify parent component if callback provided
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }

      alert('Profile photo updated successfully!');
    } catch (error) {
      console.error('❌ Failed to update photo:', error);
      alert('Failed to update profile photo. Please try again.');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      handlePhotoUpload(file);
    }
  };

  if (!user) {
    return (
      <div className={`alert alert-warning ${isCollapsed ? 'text-center' : ''}`} style={{ fontSize: '0.8rem' }}>
        <div>{t('userDropdown.noUser', 'No user data found')}</div>
        <div style={{ fontSize: '0.7rem', marginTop: '4px' }}>
          <button 
            className="btn btn-link btn-sm p-0" 
            onClick={() => {
              console.log('🔄 Refreshing page to retry login...');
              window.location.reload();
            }}
          >
            Try Refresh
          </button>
          {' | '}
          <button 
            className="btn btn-link btn-sm p-0" 
            onClick={() => {
              console.log('🚪 Redirecting to login...');
              localStorage.clear();
              navigate('/login');
            }}
          >
            Re-login
          </button>
        </div>
      </div>
    );
  }

  // Path to user's avatar image - Fixed the URL construction
  const avatarUrl = user.photo
    ? `http://localhost:5000/uploads/${user.photo}` 
    : 'https://i.pravatar.cc/40?img=3';

  console.log('✅ Avatar URL:', avatarUrl);
  console.log('✅ User photo field:', user.photo);

  return (
    <div className={isCollapsed ? 'text-center' : ''}>
      <div className="dropdown" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        <button
          className={`btn d-flex align-items-center ${darkMode ? 'btn-dark text-white' : 'btn-light text-dark'} border-0`}
          type="button"
          id={isCollapsed ? 'userDropdownCollapsed' : 'userDropdown'}
          data-bs-toggle="dropdown"
          aria-expanded="false"
          style={{ minWidth: 'fit-content' }}
          title={user?.username || user?.name || user?.email || t('userDropdown.userMenu', 'Menu utilisateur')}
        >
          <div className="position-relative">
            <img
              src={avatarUrl}
              alt="user"
              className={isRTL ? "ms-2 rounded-circle" : "me-2 rounded-circle"}
              width="40"
              height="40"
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                console.log('❌ Avatar failed to load:', avatarUrl);
                e.target.src = 'https://i.pravatar.cc/40?img=3';
              }}
            />
            {/* Small camera icon overlay */}
            <div 
              className="position-absolute bottom-0 end-0 bg-primary rounded-circle d-flex align-items-center justify-content-center"
              style={{ 
                width: '16px', 
                height: '16px', 
                fontSize: '8px',
                cursor: 'pointer',
                border: '2px solid white'
              }}
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById('photoUpload').click();
              }}
            >
              📷
            </div>
          </div>
          {!isCollapsed && (
            <div className={`d-flex flex-column ${isRTL ? 'text-end' : 'text-start'}`}>
              <span className="fw-semibold small">
                {user?.nom || user?.username || user?.name || user?.firstName || user?.prenom || t('userDropdown.user', 'Utilisateur')}
              </span>
              <span className="small text-muted">
                {user?.role || user?.email || user?.profile?.name || t('userDropdown.role', 'Rôle')}
              </span>
            </div>
          )}
        </button>

        {/* Hidden file input */}
        <input
          type="file"
          id="photoUpload"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />

        <ul
          className={`dropdown-menu shadow py-2 ${isRTL ? '' : 'dropdown-menu-end'} ${darkMode ? 'bg-dark text-white' : ''}`}
          aria-labelledby={isCollapsed ? 'userDropdownCollapsed' : 'userDropdown'}
          style={{ 
            minWidth: '200px', 
            borderRadius: '0.5rem',
            right: isRTL ? 'auto' : '0',
            left: isRTL ? '0' : 'auto'
          }}
        >
          {/* User info at top */}
          <li className="px-3 py-2 border-bottom">
            <div className={`small ${darkMode ? 'text-light' : 'text-muted'}`}>
              <div className="fw-semibold">
                {user?.nom || user?.username || user?.name || user?.firstName || user?.prenom || t('userDropdown.user', 'Utilisateur')}
              </div>
              {user?.email && (
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                  {user.email}
                </div>
              )}
              {user?.role && (
                <div className="text-info" style={{ fontSize: '0.75rem' }}>
                  {user.role}
                </div>
              )}
              {user?.id_user && (
                <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                  ID: {user.id_user}
                </div>
              )}
            </div>
          </li>

          {/* Change Photo option */}
          <li>
            <button 
              className={`dropdown-item d-flex align-items-center py-2 ${darkMode ? 'text-white' : ''}`} 
              onClick={() => document.getElementById('photoUpload').click()}
            >
              <span className={isRTL ? "ms-2" : "me-2"}>📸</span> 
              {t('userDropdown.changePhoto', 'Change Photo')}
            </button>
          </li>

          <li><hr className="dropdown-divider my-1" /></li>

          <li>
            <button className={`dropdown-item d-flex align-items-center py-2 ${darkMode ? 'text-white' : ''}`} onClick={() => navigate('/projects')}>
              <span className={isRTL ? "ms-2" : "me-2"}>📁</span> 
              {t('userDropdown.newProject', 'New project')}
            </button>
          </li>
          <li>
            <button className={`dropdown-item d-flex align-items-center py-2 ${darkMode ? 'text-white' : ''}`} onClick={() => navigate('/settings')}>
              <span className={isRTL ? "ms-2" : "me-2"}>⚙️</span> 
              {t('userDropdown.settings', 'Paramètres')}
            </button>
          </li>
          <li>
            <button className={`dropdown-item d-flex align-items-center py-2 ${darkMode ? 'text-white' : ''}`} onClick={() => navigate('/profile')}>
              <span className={isRTL ? "ms-2" : "me-2"}>👤</span> 
              {t('userDropdown.myProfile', 'Mon Profil')}
            </button>
          </li>
          
          {/* Debug info (remove in production) */}
          <li><hr className="dropdown-divider my-1" /></li>
          <li className="px-3 py-1">
            <div style={{ fontSize: '0.7rem', color: '#666' }}>
              Debug: User loaded from {currentUser ? 'props' : 'localStorage'}
              <br />
              Photo: {user.photo || 'No photo'}
            </div>
          </li>
          
          <li><hr className="dropdown-divider my-1" /></li>
          <li>
            <button className="dropdown-item d-flex align-items-center py-2 text-danger" onClick={onLogout}>
              <span className={isRTL ? "ms-2" : "me-2"}>🚪</span> 
              {t('userDropdown.logout', 'Se déconnecter')}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserDropdown;
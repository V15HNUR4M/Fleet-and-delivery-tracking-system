import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/orders': 'Orders',
  '/vehicles': 'Fleet',
  '/drivers': 'Drivers',
  '/dispatch': 'Dispatch Console',
  '/tracking': 'Live Tracking',
  '/analytics': 'Analytics',
  '/admin': 'Admin',
};

const TopNavbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const dropdownRef = useRef(null);

  const pageTitle = PAGE_TITLES[location.pathname] ?? 'FleetOps';

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabel = user?.role ?? '';

  return (
    <header className="topnav" role="banner">
      {/* Menu toggle (mobile) */}
      <button
        className="icon-btn topnav-mobile-btn"
        onClick={onMenuClick}
        aria-label="Toggle sidebar"
        id="btn-mobile-menu"
      >
        <Menu size={16} />
      </button>

      {/* Breadcrumb */}
      <div className="topnav-breadcrumb">
        <span>FleetOps</span>
        <span className="topnav-breadcrumb-sep">/</span>
        <span className="topnav-breadcrumb-current">{pageTitle}</span>
      </div>

      {/* Live indicator */}
      <div className="topnav-live" style={{ marginLeft: 8 }}>
        <span className="topnav-live-dot" />
        LIVE
      </div>

      <div style={{ flex: 1 }} />

      {/* Clock */}
      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
        {time.toLocaleTimeString('en-GB', { hour12: false })}
      </span>

      <div className="topnav-actions">
        {/* Role pill */}
        <div className="role-pill">
          <User size={11} />
          {roleLabel}
        </div>

        {/* Notification bell */}
        <button className="icon-btn" aria-label="Notifications">
          <Bell size={16} />
        </button>

        {/* User menu */}
        <div className="user-menu" ref={dropdownRef}>
          <div
            className="flex items-center gap-2"
            style={{ cursor: 'pointer', gap: 6 }}
            onClick={() => setDropdownOpen((o) => !o)}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <div className="user-avatar" aria-label="User menu">
              {roleLabel.slice(0, 1)}
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </div>

          {dropdownOpen && (
            <div className="user-dropdown" role="menu">
              <div className="user-dropdown-header">
                <div className="user-dropdown-name">{roleLabel} User</div>
                <div className="user-dropdown-role">{roleLabel}</div>
              </div>
              <button
                className="dropdown-item dropdown-item--danger"
                role="menuitem"
                onClick={handleLogout}
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;

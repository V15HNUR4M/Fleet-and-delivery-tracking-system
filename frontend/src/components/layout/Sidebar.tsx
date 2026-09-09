import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  Users,
  ShoppingBag,
  Navigation,
  MapPin,
  BarChart2,
  Settings,
  Zap,
  Activity,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { ROLE_NAV_ACCESS } from '../../constants';

interface NavItem {
  key: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}

const ALL_NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Dispatcher', path: '/', icon: <LayoutDashboard size={17} /> },
  { key: 'orders', label: 'Orders', path: '/orders', icon: <ShoppingBag size={17} /> },
  { key: 'vehicles', label: 'Fleet', path: '/vehicles', icon: <Truck size={17} /> },
  { key: 'drivers', label: 'Drivers', path: '/drivers', icon: <Users size={17} /> },
  { key: 'dispatch', label: 'Dispatch', path: '/dispatch', icon: <Zap size={17} /> },
  { key: 'tracking', label: 'Tracking', path: '/tracking', icon: <MapPin size={17} /> },
  { key: 'analytics', label: 'Analytics', path: '/analytics', icon: <BarChart2 size={17} /> },
  { key: 'admin', label: 'Admin', path: '/admin', icon: <Settings size={17} /> },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const allowedKeys = user ? ROLE_NAV_ACCESS[user.role] : [];
  const visibleItems = ALL_NAV_ITEMS.filter((item) => allowedKeys.includes(item.key));

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99,
          }}
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`sidebar ${mobileOpen ? 'sidebar--mobile-open' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Activity size={18} color="#fff" />
          </div>
          <div>
            <div className="sidebar-logo-text">FleetOps</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {visibleItems.map((item) => {
            const isActive = item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.key}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={onMobileClose}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="nav-item-icon">{item.icon}</span>
                <span className="nav-item-label">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Quick stats */}
        {user?.role !== 'CUSTOMER' && user?.role !== 'DRIVER' && (
          <div className="sidebar-quick-stats">
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 8 }}>
              Quick Stats
            </div>
            <div className="quick-stat">
              <span>Role</span>
              <span className="quick-stat-value" style={{ color: 'var(--accent-blue-light)', fontSize: 11 }}>
                {user?.role}
              </span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;

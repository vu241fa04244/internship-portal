import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  Briefcase,
  Bell,
  User as UserIcon,
  LogOut,
  Sparkles,
  FileText,
  BookmarkCheck,
  Menu,
  X,
  ShieldCheck,
  Layers,
  ChevronDown,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isStudent, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Briefcase size={22} color="#38bdf8" />
          </div>
          <span>SkillBridge</span>
          <span className="navbar-brand-badge">AI Portal</span>
        </Link>

        {/* Mobile menu toggle */}
        <button
          className="mobile-nav-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <nav className={`navbar-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <NavLink
            to="/internships"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Explore Internships
          </NavLink>

          {isAuthenticated && isStudent && (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/recommendations"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Sparkles size={15} color="#0ea5e9" /> AI Matches
                </span>
              </NavLink>
              <NavLink
                to="/resume-analyzer"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Resume Analyzer
              </NavLink>
              <NavLink
                to="/applications"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Applications
              </NavLink>
            </>
          )}

          {isAuthenticated && isAdmin && (
            <>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Overview
              </NavLink>
              <NavLink
                to="/admin/internships"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Manage Internships
              </NavLink>
              <NavLink
                to="/admin/applications"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Applications
              </NavLink>
              <NavLink
                to="/admin/students"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Students
              </NavLink>
            </>
          )}
        </nav>

        {/* User / Authentication Actions */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              {/* Notifications Bell */}
              <Link
                to="/notifications"
                className="notification-bell-btn"
                aria-label={`Notifications (${unreadCount} unread)`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </Link>

              {/* Profile Dropdown */}
              <div className="user-profile-menu" ref={menuRef}>
                <button
                  className="user-profile-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-expanded={userMenuOpen}
                >
                  <div className="user-avatar-circle">{getInitials(user.name)}</div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} color="#64748b" />
                </button>

                {userMenuOpen && (
                  <div className="user-dropdown-menu">
                    <div className="dropdown-user-info">
                      <div className="dropdown-user-name">{user.name}</div>
                      <div className="dropdown-user-email">{user.email}</div>
                      <div style={{ marginTop: '0.35rem' }}>
                        <span
                          className={`badge ${
                            isAdmin ? 'badge-shortlisted' : 'badge-category'
                          }`}
                        >
                          {isAdmin ? 'Administrator' : 'Student'}
                        </span>
                      </div>
                    </div>

                    {isStudent && (
                      <>
                        <Link
                          to="/profile"
                          className="dropdown-item"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <UserIcon size={16} /> My Profile & Skills
                        </Link>
                        <Link
                          to="/applications"
                          className="dropdown-item"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <BookmarkCheck size={16} /> Track Applications
                        </Link>
                        <Link
                          to="/resume-analyzer"
                          className="dropdown-item"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <FileText size={16} /> ATS Resume Score
                        </Link>
                      </>
                    )}

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="dropdown-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <ShieldCheck size={16} /> Admin Command Center
                      </Link>
                    )}

                    <div className="dropdown-divider" />

                    <button className="dropdown-item" onClick={handleLogout} style={{ color: '#ef4444' }}>
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register as Student
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

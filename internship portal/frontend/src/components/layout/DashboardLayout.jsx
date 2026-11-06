import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Briefcase,
  Sparkles,
  FileCheck2,
  BookmarkCheck,
  ShieldAlert,
  Users,
  Building,
  Bell,
} from 'lucide-react';

const DashboardLayout = ({
  title,
  subtitle,
  action = null,
  children,
}) => {
  const { user, isAdmin, isStudent } = useAuth();

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-heading">Navigation Menu</div>

        {isStudent && (
          <>
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <User size={18} />
              <span>Profile & Skills</span>
            </NavLink>

            <NavLink
              to="/recommendations"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Sparkles size={18} color="#0284c7" />
              <span>AI Recommendations</span>
            </NavLink>

            <NavLink
              to="/resume-analyzer"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <FileCheck2 size={18} />
              <span>Resume Analyzer</span>
            </NavLink>

            <NavLink
              to="/applications"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <BookmarkCheck size={18} />
              <span>My Applications</span>
            </NavLink>

            <NavLink
              to="/internships"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Briefcase size={18} />
              <span>Browse Internships</span>
            </NavLink>
          </>
        )}

        {isAdmin && (
          <>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard Overview</span>
            </NavLink>

            <NavLink
              to="/admin/internships"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Building size={18} />
              <span>Manage Internships</span>
            </NavLink>

            <NavLink
              to="/admin/applications"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <BookmarkCheck size={18} />
              <span>All Applications</span>
            </NavLink>

            <NavLink
              to="/admin/students"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Users size={18} />
              <span>Registered Students</span>
            </NavLink>
          </>
        )}

        <div className="sidebar-heading" style={{ marginTop: '1.5rem' }}>Account</div>
        <NavLink
          to="/notifications"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <Bell size={18} />
          <span>Notifications</span>
        </NavLink>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-content">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h1 className="page-title">{title}</h1>
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>

        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/cards/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Users,
  Briefcase,
  BookmarkCheck,
  CheckCircle,
  FileCheck2,
  TrendingUp,
  ArrowRight,
  Plus,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const res = await adminAPI.getDashboardStats();
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Admin Command Center">
        <LoadingSpinner message="Aggregating platform metrics..." />
      </DashboardLayout>
    );
  }

  const breakdown = stats?.statusBreakdown || {};
  const totalApps = stats?.totalApplications || 0;

  const getPercent = (count) => {
    if (!totalApps) return 0;
    return Math.round((count / totalApps) * 100);
  };

  return (
    <DashboardLayout
      title="Admin Command Center"
      subtitle="Overview of platform registrations, internship listings, and candidate applications."
      action={
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/internships" className="btn btn-primary btn-sm">
            <Plus size={16} /> Post New Internship
          </Link>
          <Link to="/admin/applications" className="btn btn-secondary btn-sm">
            Review Applications
          </Link>
        </div>
      }
    >
      {/* Metric Cards */}
      <div className="stats-grid">
        <StatCard
          label="Registered Students"
          value={stats?.totalStudents || 0}
          hint="Active student profiles"
          icon={Users}
          colorScheme="blue"
        />
        <StatCard
          label="Internship Postings"
          value={stats?.totalInternships || 0}
          hint={`${stats?.activeInternships || 0} active & accepting`}
          icon={Briefcase}
          colorScheme="amber"
        />
        <StatCard
          label="Total Applications"
          value={stats?.totalApplications || 0}
          hint="Submitted by candidates"
          icon={BookmarkCheck}
          colorScheme="purple"
        />
        <StatCard
          label="Accepted Offers"
          value={breakdown.Accepted || 0}
          hint={`${getPercent(breakdown.Accepted || 0)}% conversion rate`}
          icon={CheckCircle}
          colorScheme="emerald"
        />
      </div>

      {/* Visual Application Status Breakdown */}
      <div className="status-bar-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 className="status-bar-title" style={{ margin: 0 }}>Application Status Distribution</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {totalApps} Total Applications Received
          </span>
        </div>

        {/* Multi-segment visual bar */}
        <div className="status-bar-track">
          <div
            className="status-bar-segment"
            style={{ width: `${getPercent(breakdown.Accepted || 0)}%`, backgroundColor: '#10b981' }}
            title={`Accepted: ${breakdown.Accepted || 0}`}
          />
          <div
            className="status-bar-segment"
            style={{ width: `${getPercent(breakdown.Shortlisted || 0)}%`, backgroundColor: '#0284c7' }}
            title={`Shortlisted: ${breakdown.Shortlisted || 0}`}
          />
          <div
            className="status-bar-segment"
            style={{ width: `${getPercent(breakdown.Pending || 0)}%`, backgroundColor: '#f59e0b' }}
            title={`Pending: ${breakdown.Pending || 0}`}
          />
          <div
            className="status-bar-segment"
            style={{ width: `${getPercent(breakdown.Rejected || 0)}%`, backgroundColor: '#ef4444' }}
            title={`Rejected: ${breakdown.Rejected || 0}`}
          />
          <div
            className="status-bar-segment"
            style={{ width: `${getPercent(breakdown.Withdrawn || 0)}%`, backgroundColor: '#94a3b8' }}
            title={`Withdrawn: ${breakdown.Withdrawn || 0}`}
          />
        </div>

        {/* Legend */}
        <div className="status-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#10b981' }} />
            <span>Accepted ({breakdown.Accepted || 0})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#0284c7' }} />
            <span>Shortlisted ({breakdown.Shortlisted || 0})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#f59e0b' }} />
            <span>Pending ({breakdown.Pending || 0})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#ef4444' }} />
            <span>Rejected ({breakdown.Rejected || 0})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#94a3b8' }} />
            <span>Withdrawn ({breakdown.Withdrawn || 0})</span>
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="table-wrapper">
        <div className="table-header-bar">
          <h3 className="table-header-title">Recent Candidate Applications</h3>
          <Link to="/admin/applications" className="btn btn-secondary btn-sm">
            View All Applications &rarr;
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Internship Role</th>
                <th>Company</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentApplications?.length > 0 ? (
                stats.recentApplications.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>
                        {app.student?.name || 'Applicant'}
                      </div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                        {app.student?.email}
                      </div>
                    </td>
                    <td>{app.internship?.title || 'Internship'}</td>
                    <td>{app.internship?.company || 'Company'}</td>
                    <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`badge badge-${(app.status || 'pending').toLowerCase()}`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <Link
                        to="/admin/applications"
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No applications submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

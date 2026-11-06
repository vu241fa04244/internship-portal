import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { applicationAPI, aiAPI, notificationAPI } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/cards/StatCard';
import InternshipCard from '../../components/cards/InternshipCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import {
  FileText,
  BookmarkCheck,
  CheckCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Briefcase,
  Bell,
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [appRes, recRes, notifRes] = await Promise.allSettled([
          applicationAPI.getMyApplications(),
          aiAPI.getRecommendations(),
          notificationAPI.getAll(),
        ]);

        if (appRes.status === 'fulfilled' && appRes.value.data.success) {
          setApplications(appRes.value.data.applications || []);
        }

        if (recRes.status === 'fulfilled' && recRes.value.data.success) {
          setRecommendations(recRes.value.data.recommendations?.slice(0, 3) || []);
        }

        if (notifRes.status === 'fulfilled' && notifRes.value.data.success) {
          setNotifications(notifRes.value.data.notifications?.slice(0, 4) || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalApplied = applications.length;
  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
  const acceptedCount = applications.filter((a) => a.status === 'Accepted').length;
  const skillsCount = user?.profile?.skills?.length || 0;

  // Profile completeness score (based on phone, university, skills, resume)
  let completeness = 20; // user account created
  if (user?.profile?.university) completeness += 20;
  if (user?.profile?.skills?.length >= 3) completeness += 30;
  if (user?.profile?.resumeUrl) completeness += 30;

  if (loading) {
    return (
      <DashboardLayout title="Student Dashboard">
        <LoadingSpinner message="Loading your dashboard insights..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={`Hello, ${user?.name?.split(' ')[0] || 'Student'}! 👋`}
      subtitle="Track your internship pipeline and review AI recommendations."
      action={
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/resume-analyzer" className="btn btn-secondary btn-sm">
            <FileText size={16} /> ATS Resume Test
          </Link>
          <Link to="/internships" className="btn btn-primary btn-sm">
            <Briefcase size={16} /> Explore Internships
          </Link>
        </div>
      }
    >
      {/* Profile Completeness Banner */}
      {completeness < 100 && (
        <div
          className="card"
          style={{
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, var(--sky-50) 0%, #ffffff 100%)',
            border: '1px solid var(--sky-200)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy-900)' }}>
              Profile Readiness: {completeness}%
            </span>
            <Link to="/profile" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--sky-700)' }}>
              Complete Profile & Upload Resume &rarr;
            </Link>
          </div>
          <div style={{ height: 8, backgroundColor: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${completeness}%`,
                backgroundColor: completeness > 70 ? 'var(--success)' : 'var(--sky-600)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="stats-grid">
        <StatCard
          label="Total Applications"
          value={totalApplied}
          hint="Submitted opportunities"
          icon={BookmarkCheck}
          colorScheme="blue"
        />
        <StatCard
          label="Shortlisted"
          value={shortlistedCount}
          hint="Under hiring manager review"
          icon={Sparkles}
          colorScheme="purple"
        />
        <StatCard
          label="Accepted Offers"
          value={acceptedCount}
          hint="Successful placements"
          icon={CheckCircle}
          colorScheme="emerald"
        />
        <StatCard
          label="Profile Skills"
          value={skillsCount}
          hint="Verified technical tags"
          icon={TrendingUp}
          colorScheme="amber"
        />
      </div>

      {/* Grid Layout: Top Recommendations & Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left Column: Top Recommended Internships */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--navy-900)' }}>
              Top AI Skill Matches
            </h2>
            <Link to="/recommendations" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              View All Recommendations &rarr;
            </Link>
          </div>

          {recommendations.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="No recommendations yet"
              description="Add your skills and upload your PDF resume to receive tailored internship recommendations."
              action={
                <Link to="/profile" className="btn btn-primary btn-sm">
                  Add Skills to Profile
                </Link>
              }
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recommendations.map((internship) => (
                <InternshipCard key={internship._id} internship={internship} />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Recent Notifications & Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Notifications Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--navy-900)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bell size={18} color="var(--sky-600)" /> Recent Notifications
              </h3>
              <Link to="/notifications" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                View All
              </Link>
            </div>

            {notifications.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No new notifications. You're all caught up!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: n.isRead ? 'var(--bg-primary)' : 'var(--sky-50)',
                      border: `1px solid ${n.isRead ? 'var(--border)' : 'var(--sky-200)'}`,
                      fontSize: '0.85rem',
                    }}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--navy-900)', marginBottom: '0.15rem' }}>
                      {n.title}
                    </div>
                    <div style={{ color: 'var(--navy-700)', fontSize: '0.8rem', lineHeight: 1.4 }}>
                      {n.message}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      {new Date(n.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ATS Resume Quick Score Card */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, var(--navy-950) 0%, var(--navy-900) 100%)',
              color: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Sparkles size={20} color="#38bdf8" />
              <h3 style={{ color: '#ffffff', fontSize: '1.1rem' }}>Test Your Resume</h3>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Get an instant ATS score rating, detect missing skills for your target industry, and receive actionable tips before applying.
            </p>
            <Link to="/resume-analyzer" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
              Run ATS Diagnostics
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;

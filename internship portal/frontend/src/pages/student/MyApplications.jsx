import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationAPI } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ApplicationCard from '../../components/cards/ApplicationCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';
import { BookmarkCheck, Briefcase, AlertTriangle } from 'lucide-react';

const STATUS_TABS = ['All', 'Pending', 'Shortlisted', 'Accepted', 'Rejected', 'Withdrawn'];

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('All');
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await applicationAPI.getMyApplications();
      if (res.data.success) {
        setApplications(res.data.applications || []);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
      addToast('Failed to load applications.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleOpenWithdraw = (appId) => {
    setSelectedAppId(appId);
    setWithdrawModalOpen(true);
  };

  const handleConfirmWithdraw = async () => {
    if (!selectedAppId) return;

    try {
      setWithdrawing(true);
      const res = await applicationAPI.withdraw(selectedAppId);
      if (res.data.success) {
        addToast('Application withdrawn successfully.');
        setApplications((prev) =>
          prev.map((app) =>
            app._id === selectedAppId ? { ...app, status: 'Withdrawn' } : app
          )
        );
        setWithdrawModalOpen(false);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to withdraw application.', 'error');
    } finally {
      setWithdrawing(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (selectedTab === 'All') return true;
    return app.status === selectedTab;
  });

  if (loading) {
    return (
      <DashboardLayout title="My Applications">
        <LoadingSpinner message="Loading your submitted applications..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="My Internship Applications"
      subtitle="Track review milestones, hiring manager feedback, and application decisions in real-time."
      action={
        <Link to="/internships" className="btn btn-primary btn-sm">
          <Briefcase size={16} /> Explore More Roles
        </Link>
      }
    >
      <Toast toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '0.75rem',
          marginBottom: '1.75rem',
          overflowX: 'auto',
        }}
      >
        {STATUS_TABS.map((tab) => {
          const count =
            tab === 'All'
              ? applications.length
              : applications.filter((a) => a.status === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className="btn btn-sm"
              style={{
                backgroundColor: selectedTab === tab ? 'var(--navy-900)' : 'transparent',
                color: selectedTab === tab ? '#ffffff' : 'var(--navy-700)',
                border: '1px solid',
                borderColor: selectedTab === tab ? 'var(--navy-900)' : 'var(--border)',
                fontWeight: 600,
                borderRadius: 'var(--radius-full)',
              }}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <EmptyState
          icon={BookmarkCheck}
          title={selectedTab === 'All' ? 'No applications submitted yet' : `No applications in '${selectedTab}' status`}
          description={
            selectedTab === 'All'
              ? 'Browse active student internships and submit your profile with 1-click.'
              : `You do not have any applications currently marked as ${selectedTab}.`
          }
          action={
            <Link to="/internships" className="btn btn-primary btn-sm">
              Discover Internships
            </Link>
          }
        />
      ) : (
        <div>
          {filteredApplications.map((app) => (
            <ApplicationCard
              key={app._id}
              application={app}
              onWithdraw={handleOpenWithdraw}
            />
          ))}
        </div>
      )}

      {/* Withdraw Confirmation Modal */}
      <Modal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        title="Withdraw Application"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setWithdrawModalOpen(false)}
              disabled={withdrawing}
            >
              Keep Application
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleConfirmWithdraw}
              disabled={withdrawing}
            >
              {withdrawing ? 'Withdrawing...' : 'Yes, Withdraw Application'}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
              Are you sure you want to withdraw?
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Withdrawing will notify the hiring team and remove your application from review consideration. You will not be able to re-apply for this specific opening once withdrawn.
            </p>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default MyApplications;

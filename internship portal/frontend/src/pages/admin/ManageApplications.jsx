import React, { useState, useEffect } from 'react';
import { adminAPI, applicationAPI } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';
import {
  BookmarkCheck,
  Search,
  Filter,
  FileText,
  CheckCircle,
  Clock,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

const STATUS_OPTIONS = ['All', 'Pending', 'Shortlisted', 'Accepted', 'Rejected', 'Withdrawn'];

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeApp, setActiveApp] = useState(null);
  const [newStatus, setNewStatus] = useState('Pending');
  const [feedback, setFeedback] = useState('');
  const [updating, setUpdating] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = { limit: 50 };
      if (selectedStatus !== 'All') params.status = selectedStatus;
      const res = await adminAPI.getApplications(params);
      if (res.data.success) {
        setApplications(res.data.applications || []);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
      addToast('Failed to load applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [selectedStatus]);

  const handleOpenReview = (app) => {
    setActiveApp(app);
    setNewStatus(app.status || 'Pending');
    setFeedback(app.adminFeedback || '');
    setReviewModalOpen(true);
  };

  const handleSaveStatus = async () => {
    if (!activeApp) return;

    try {
      setUpdating(true);
      const res = await applicationAPI.updateStatus(activeApp._id, {
        status: newStatus,
        adminFeedback: feedback,
      });

      if (res.data.success) {
        addToast(`Application status updated to "${newStatus}" and candidate notified.`);
        setApplications((prev) =>
          prev.map((a) =>
            a._id === activeApp._id
              ? { ...a, status: newStatus, adminFeedback: feedback, reviewedAt: new Date() }
              : a
          )
        );
        setReviewModalOpen(false);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <DashboardLayout
      title="Application Review Center"
      subtitle="Review candidate applications, inspect resumes, provide feedback, and update decision statuses."
    >
      <Toast toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '0.75rem',
          marginBottom: '1.5rem',
          overflowX: 'auto',
        }}
      >
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className="btn btn-sm"
            style={{
              backgroundColor: selectedStatus === status ? 'var(--navy-900)' : 'transparent',
              color: selectedStatus === status ? '#ffffff' : 'var(--navy-700)',
              border: '1px solid',
              borderColor: selectedStatus === status ? 'var(--navy-900)' : 'var(--border)',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading applications..." />
      ) : (
        <div className="table-wrapper">
          <div className="table-header-bar">
            <h3 className="table-header-title">
              Candidate Applications ({applications.length})
            </h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Internship</th>
                  <th>Company</th>
                  <th>Applied On</th>
                  <th>Resume</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>
                          {app.student?.name || 'Applicant'}
                        </div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                          {app.student?.email}
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{app.internship?.title || 'Internship'}</td>
                      <td>{app.internship?.company || 'Company'}</td>
                      <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                      <td>
                        {app.resumeSnapshot?.url ? (
                          <a
                            href={app.resumeSnapshot.url}
                            target="_blank"
                            rel="noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.825rem' }}
                          >
                            <FileText size={14} /> PDF
                          </a>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>-</span>
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge badge-${(app.status || 'pending').toLowerCase()}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleOpenReview(app)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.65rem' }}
                        >
                          Review & Decide
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                      No applications currently match this status filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review & Status Decision Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Review Candidate Application"
        size="lg"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setReviewModalOpen(false)}
              disabled={updating}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSaveStatus}
              disabled={updating}
            >
              {updating ? 'Saving Status...' : 'Save Decision & Notify Candidate'}
            </button>
          </>
        }
      >
        {activeApp && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Candidate & Job Summary Header */}
            <div
              style={{
                backgroundColor: 'var(--bg-primary)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Applicant</div>
                <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>{activeApp.student?.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{activeApp.student?.email}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Role Applied For</div>
                <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>{activeApp.internship?.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{activeApp.internship?.company}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Candidate Resume</div>
                {activeApp.resumeSnapshot?.url ? (
                  <a
                    href={activeApp.resumeSnapshot.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}
                  >
                    <FileText size={16} /> Open PDF Resume <ExternalLink size={14} />
                  </a>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No file attached</span>
                )}
              </div>
            </div>

            {/* Cover Note */}
            {activeApp.coverNote && (
              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--navy-800)', marginBottom: '0.35rem' }}>
                  Candidate Note:
                </h4>
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    color: 'var(--navy-800)',
                    fontStyle: 'italic',
                  }}
                >
                  "{activeApp.coverNote}"
                </div>
              </div>
            )}

            {/* Status Change Form */}
            <div className="form-group">
              <label className="form-label">Update Decision Status</label>
              <select
                className="form-select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="Pending">Pending Review</option>
                <option value="Shortlisted">Shortlisted for Interview</option>
                <option value="Accepted">Accepted / Offer Extended</option>
                <option value="Rejected">Rejected</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                Feedback for Candidate (Included in notification)
              </label>
              <textarea
                rows={3}
                className="form-textarea"
                placeholder="e.g. Strong technical match with our backend stack. Scheduling round 1 technical interview."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default ManageApplications;

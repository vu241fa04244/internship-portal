import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Building,
  MapPin,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  HelpCircle,
} from 'lucide-react';

const ApplicationCard = ({ application, onWithdraw }) => {
  if (!application) return null;

  const {
    _id,
    internship,
    status,
    appliedAt,
    reviewedAt,
    adminFeedback,
    resumeSnapshot,
    coverNote,
  } = application;

  const getStatusBadge = (currentStatus) => {
    switch (currentStatus) {
      case 'Accepted':
        return (
          <span className="badge badge-accepted">
            <CheckCircle size={12} /> Accepted
          </span>
        );
      case 'Shortlisted':
        return (
          <span className="badge badge-shortlisted">
            <CheckCircle size={12} /> Shortlisted
          </span>
        );
      case 'Rejected':
        return (
          <span className="badge badge-rejected">
            <XCircle size={12} /> Rejected
          </span>
        );
      case 'Withdrawn':
        return (
          <span className="badge badge-withdrawn">
            <AlertCircle size={12} /> Withdrawn
          </span>
        );
      default:
        return (
          <span className="badge badge-pending">
            <HelpCircle size={12} /> Pending Review
          </span>
        );
    }
  };

  const isEligibleForWithdrawal = status === 'Pending' || status === 'Shortlisted';

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-900)' }}>
              {internship?.title || 'Internship Opportunity'}
            </h3>
            {getStatusBadge(status)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Building size={15} /> {internship?.company || 'Company'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={15} /> {internship?.location || 'Remote'}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Applied on: {new Date(appliedAt).toLocaleDateString()}
          </div>
          {reviewedAt && (
            <div style={{ fontSize: '0.8rem', color: 'var(--sky-700)', marginTop: '0.2rem' }}>
              Reviewed: {new Date(reviewedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Cover note preview */}
      {coverNote && (
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            color: 'var(--navy-700)',
            marginBottom: '1rem',
            fontStyle: 'italic',
          }}
        >
          "{coverNote}"
        </div>
      )}

      {/* Admin feedback if given */}
      {adminFeedback && (
        <div
          style={{
            backgroundColor: status === 'Accepted' || status === 'Shortlisted' ? 'var(--sky-50)' : 'var(--danger-bg)',
            border: `1px solid ${status === 'Accepted' || status === 'Shortlisted' ? 'var(--sky-200)' : 'var(--danger-border)'}`,
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            color: status === 'Accepted' || status === 'Shortlisted' ? 'var(--sky-900)' : '#991b1b',
            marginBottom: '1rem',
          }}
        >
          <strong>Hiring Team Feedback:</strong> {adminFeedback}
        </div>
      )}

      {/* Card Footer Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border)',
          paddingTop: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          {resumeSnapshot?.url ? (
            <a
              href={resumeSnapshot.url}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <FileText size={16} /> View Attached Resume ({resumeSnapshot.originalName})
            </a>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>Resume attached</span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {internship?._id && (
            <Link
              to={`/internships/${internship._id}`}
              className="btn btn-secondary btn-sm"
            >
              View Listing
            </Link>
          )}

          {isEligibleForWithdrawal && (
            <button
              onClick={() => onWithdraw(_id)}
              className="btn btn-sm"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--danger)',
                border: '1px solid var(--danger-border)',
              }}
            >
              Withdraw Application
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { internshipAPI, applicationAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';
import {
  MapPin,
  Clock,
  Calendar,
  Building,
  DollarSign,
  Users,
  Sparkles,
  CheckCircle,
  XCircle,
  FileText,
  ArrowLeft,
  AlertCircle,
  Send,
} from 'lucide-react';

const InternshipDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated, isStudent } = useAuth();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const toastId = Date.now();
    setToasts((prev) => [...prev, { id: toastId, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 4500);
  };

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await internshipAPI.getById(id);
      if (res.data.success) {
        setInternship(res.data.internship);
      }
    } catch (err) {
      console.error('Failed to load internship:', err);
      addToast('Could not find requested internship.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id, user]);

  const handleApply = async () => {
    // Check if resume is uploaded
    if (!user?.profile?.resumeUrl) {
      addToast('Please upload your PDF resume on your profile before applying.', 'error');
      setApplyModalOpen(false);
      navigate('/profile');
      return;
    }

    try {
      setSubmitting(true);
      const res = await applicationAPI.apply({
        internshipId: id,
        coverNote,
      });

      if (res.data.success) {
        addToast('Application submitted successfully!');
        setApplyModalOpen(false);
        setInternship((prev) => ({
          ...prev,
          hasApplied: true,
          applicationStatus: 'Pending',
          applicantsCount: (prev.applicantsCount || 0) + 1,
        }));
      }
    } catch (err) {
      addToast(
        err.response?.data?.message || 'Failed to submit application. Please try again.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '5rem 0' }}>
        <LoadingSpinner message="Loading opportunity specifications..." />
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>Internship opportunity not found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>
          This opportunity may have been removed or closed.
        </p>
        <Link to="/internships" className="btn btn-primary">
          Back to Internship Listings
        </Link>
      </div>
    );
  }

  const isExpired = new Date(internship.deadline) < new Date();
  const skillMatch = internship.skillMatch;

  return (
    <div className="internship-detail-page">
      <Toast toasts={toasts} onDismiss={(tid) => setToasts((t) => t.filter((x) => x.id !== tid))} />

      {/* Hero Header Banner */}
      <section className="internship-detail-hero">
        <div className="container">
          <Link
            to="/internships"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#94a3b8',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
            }}
          >
            <ArrowLeft size={16} /> Back to all internships
          </Link>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '2rem',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                <span className="badge badge-category">{internship.category}</span>
                <span className="badge badge-remote">{internship.workType}</span>
                {internship.hasApplied && (
                  <span className="badge badge-accepted">
                    <CheckCircle size={13} /> Already Applied
                  </span>
                )}
                {isExpired && (
                  <span className="badge badge-rejected">Application Deadline Passed</span>
                )}
              </div>

              <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#ffffff', marginBottom: '0.5rem' }}>
                {internship.title}
              </h1>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  color: '#cbd5e1',
                  fontSize: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ffffff', fontWeight: 600 }}>
                  <Building size={18} color="#38bdf8" /> {internship.company}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={18} color="#38bdf8" /> {internship.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Users size={18} color="#38bdf8" /> {internship.applicantsCount || 0} Applicants
                </span>
              </div>
            </div>

            {/* Quick Action in Header */}
            <div>
              {isAuthenticated && isStudent ? (
                internship.hasApplied ? (
                  <Link to="/applications" className="btn btn-secondary btn-lg">
                    <CheckCircle size={18} color="#10b981" /> Track Application
                  </Link>
                ) : isExpired ? (
                  <button className="btn btn-secondary btn-lg" disabled>
                    Applications Closed
                  </button>
                ) : (
                  <button
                    onClick={() => setApplyModalOpen(true)}
                    className="btn btn-primary btn-lg"
                  >
                    <span>Apply for Opportunity</span>
                    <Send size={16} />
                  </button>
                )
              ) : !isAuthenticated ? (
                <Link to="/login" className="btn btn-primary btn-lg">
                  Sign In to Apply
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Main Details & Sidebar Grid */}
      <div className="container">
        <div className="internship-detail-grid">
          {/* Main Content Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* AI Skill Match Analysis Box (if authenticated student) */}
            {isAuthenticated && isStudent && skillMatch && (
              <div
                className="card"
                style={{
                  padding: '1.75rem',
                  border: '1px solid var(--sky-200)',
                  background: 'linear-gradient(135deg, var(--sky-50) 0%, #ffffff 100%)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={22} color="var(--sky-600)" />
                    <h2 style={{ fontSize: '1.25rem', color: 'var(--navy-900)' }}>
                      AI Skill Match: {skillMatch.matchPercentage}%
                    </h2>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Deterministic comparison with your profile
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ height: 10, backgroundColor: 'var(--border)', borderRadius: 5, overflow: 'hidden', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${skillMatch.matchPercentage}%`,
                      background: 'linear-gradient(90deg, #0284c7, #38bdf8)',
                      transition: 'width 0.4s',
                    }}
                  />
                </div>

                {/* Matched vs Missing skills */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#065f46', marginBottom: '0.4rem' }}>
                      ✓ Matched Skills ({skillMatch.matchedSkills?.length || 0})
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {skillMatch.matchedSkills?.map((s, i) => (
                        <span key={i} className="skill-tag skill-tag-matched">
                          <CheckCircle size={12} /> {s}
                        </span>
                      ))}
                      {(!skillMatch.matchedSkills || skillMatch.matchedSkills.length === 0) && (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>None matched yet</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy-700)', marginBottom: '0.4rem' }}>
                      ○ Missing Skills to Learn ({skillMatch.missingSkills?.length || 0})
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {skillMatch.missingSkills?.map((s, i) => (
                        <span key={i} className="skill-tag skill-tag-missing">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem', fontStyle: 'italic' }}>
                  ℹ️ {skillMatch.disclaimer}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="detail-main-card">
              <h2 style={{ fontSize: '1.35rem', color: 'var(--navy-900)', marginBottom: '1rem' }}>
                Job Overview
              </h2>
              <p style={{ color: 'var(--navy-800)', lineHeight: 1.8, fontSize: '1rem', whiteSpace: 'pre-line' }}>
                {internship.description}
              </p>
            </div>

            {/* Responsibilities */}
            {internship.responsibilities && internship.responsibilities.length > 0 && (
              <div className="detail-main-card">
                <h2 style={{ fontSize: '1.35rem', color: 'var(--navy-900)', marginBottom: '1rem' }}>
                  Key Responsibilities
                </h2>
                <ul style={{ paddingLeft: '1.5rem', color: 'var(--navy-800)', lineHeight: 1.8, fontSize: '0.975rem' }}>
                  {internship.responsibilities.map((resp, i) => (
                    <li key={i} style={{ marginBottom: '0.4rem' }}>{resp}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {internship.requirements && internship.requirements.length > 0 && (
              <div className="detail-main-card">
                <h2 style={{ fontSize: '1.35rem', color: 'var(--navy-900)', marginBottom: '1rem' }}>
                  Candidate Requirements
                </h2>
                <ul style={{ paddingLeft: '1.5rem', color: 'var(--navy-800)', lineHeight: 1.8, fontSize: '0.975rem' }}>
                  {internship.requirements.map((req, i) => (
                    <li key={i} style={{ marginBottom: '0.4rem' }}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Sidebar: Key Specs */}
          <aside className="detail-sidebar-card">
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Monthly Compensation
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--navy-900)', marginTop: '0.2rem' }}>
                {internship.stipend > 0 ? (
                  `$${internship.stipend.toLocaleString()}`
                ) : (
                  'Unpaid'
                )}
                <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                  {' '}/ month
                </span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Duration</div>
                  <div style={{ fontWeight: 600, color: 'var(--navy-800)' }}>{internship.duration}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Work Arrangement</div>
                  <div style={{ fontWeight: 600, color: 'var(--navy-800)' }}>
                    {internship.location} ({internship.workType})
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Application Deadline</div>
                  <div style={{ fontWeight: 600, color: isExpired ? 'var(--danger)' : 'var(--navy-800)' }}>
                    {new Date(internship.deadline).toLocaleDateString()}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Open Vacancies</div>
                  <div style={{ fontWeight: 600, color: 'var(--navy-800)' }}>{internship.vacancies} Position(s)</div>
                </div>
              </div>
            </div>

            {/* Required Skills Chips */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy-800)', marginBottom: '0.65rem' }}>
                Required Skill Stack
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {internship.skillsRequired?.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Apply Action */}
            <div style={{ marginTop: '0.5rem' }}>
              {isAuthenticated && isStudent ? (
                internship.hasApplied ? (
                  <div style={{ textAlign: 'center', color: 'var(--success)', fontWeight: 600, fontSize: '0.9rem' }}>
                    ✓ You have submitted an application
                  </div>
                ) : isExpired ? (
                  <button className="btn btn-secondary" style={{ width: '100%' }} disabled>
                    Deadline Passed
                  </button>
                ) : (
                  <button
                    onClick={() => setApplyModalOpen(true)}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    Apply Now
                  </button>
                )
              ) : !isAuthenticated ? (
                <Link to="/login" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                  Log In to Apply
                </Link>
              ) : null}
            </div>
          </aside>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={`Apply for ${internship.title}`}
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setApplyModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleApply}
              disabled={submitting}
            >
              {submitting ? 'Submitting Application...' : 'Confirm & Submit Application'}
            </button>
          </>
        }
      >
        <div>
          {/* Resume Snapshot verification */}
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--sky-50)',
              border: '1px solid var(--sky-200)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--navy-900)', fontSize: '0.9rem' }}>
              Attached PDF Resume
            </div>
            {user?.profile?.resumeUrl ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', color: 'var(--navy-700)', fontSize: '0.85rem' }}>
                <FileText size={16} color="var(--sky-600)" />
                <span>{user.profile.resumeOriginalName || 'Resume.pdf'}</span>
              </div>
            ) : (
              <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                ⚠️ No resume found! Please visit your profile to upload your PDF resume first.
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Short Cover Note to Hiring Team (Optional)
            </label>
            <textarea
              rows={4}
              className="form-textarea"
              placeholder="Highlight why your skills and background make you a strong candidate for this role..."
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
            />
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            By submitting, your profile details, contact information, and attached PDF resume will be shared with the recruiter at {internship.company}.
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InternshipDetail;

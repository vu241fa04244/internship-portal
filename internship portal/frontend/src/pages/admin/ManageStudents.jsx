import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';
import {
  Users,
  Search,
  Eye,
  FileText,
  Mail,
  GraduationCap,
  MapPin,
  ExternalLink,
} from 'lucide-react';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getStudents({ search, limit: 50 });
      if (res.data.success) {
        setStudents(res.data.students || []);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
      addToast('Failed to load students', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search]);

  const handleOpenProfile = (student) => {
    setSelectedStudent(student);
    setProfileModalOpen(true);
  };

  return (
    <DashboardLayout
      title="Registered Student Directory"
      subtitle="View student profiles, skill tags, academic backgrounds, and uploaded resumes."
    >
      <Toast toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />

      {/* Search Toolbar */}
      <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: 450 }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search students by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading student records..." />
      ) : (
        <div className="table-wrapper">
          <div className="table-header-bar">
            <h3 className="table-header-title">Student Roster ({students.length})</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>University & Major</th>
                  <th>Grad Year</th>
                  <th>Skills Count</th>
                  <th>Resume</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const p = student.profile;
                  const skills = p?.skills || [];
                  const hasResume = !!p?.resumeUrl;

                  return (
                    <tr key={student._id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>
                          {student.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Joined: {new Date(student.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td>{student.email}</td>
                      <td>
                        <div style={{ color: 'var(--navy-800)', fontWeight: 500 }}>
                          {p?.university || 'Not specified'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {p?.major || 'Undeclared'}
                        </div>
                      </td>
                      <td>{p?.graduationYear || '-'}</td>
                      <td>
                        <span className="badge badge-category">
                          {skills.length} Skills
                        </span>
                      </td>
                      <td>
                        {hasResume ? (
                          <a
                            href={p.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.825rem' }}
                          >
                            <FileText size={14} /> PDF
                          </a>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>None</span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => handleOpenProfile(student)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.65rem' }}
                        >
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title={selectedStudent?.name || 'Student Profile'}
        size="lg"
        footer={
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setProfileModalOpen(false)}
          >
            Close
          </button>
        }
      >
        {selectedStudent && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Contact header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                backgroundColor: 'var(--bg-primary)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Email</div>
                <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{selectedStudent.email}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Phone</div>
                <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{selectedStudent.profile?.phone || 'Not provided'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Location</div>
                <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{selectedStudent.profile?.location || 'Not provided'}</div>
              </div>
            </div>

            {/* Academics */}
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                Academic Details
              </h4>
              <p style={{ color: 'var(--navy-800)', fontSize: '0.9rem' }}>
                <strong>{selectedStudent.profile?.university || 'University'}</strong> — {selectedStudent.profile?.educationLevel} in {selectedStudent.profile?.major || 'Major'} (Class of {selectedStudent.profile?.graduationYear})
                {selectedStudent.profile?.gpa && ` • GPA: ${selectedStudent.profile.gpa}`}
              </p>
            </div>

            {/* Bio */}
            {selectedStudent.profile?.bio && (
              <div>
                <h4 style={{ fontSize: '1rem', color: 'var(--navy-900)', marginBottom: '0.35rem' }}>
                  Professional Bio
                </h4>
                <p style={{ color: 'var(--navy-700)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {selectedStudent.profile.bio}
                </p>
              </div>
            )}

            {/* Skills */}
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                Skills ({selectedStudent.profile?.skills?.length || 0})
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {selectedStudent.profile?.skills?.map((s, i) => (
                  <span key={i} className="skill-tag">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Resume link */}
            {selectedStudent.profile?.resumeUrl && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <a
                  href={selectedStudent.profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <FileText size={16} /> Open Uploaded PDF Resume <ExternalLink size={14} />
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default ManageStudents;

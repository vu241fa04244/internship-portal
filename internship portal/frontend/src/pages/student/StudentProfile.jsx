import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Toast from '../../components/common/Toast';
import {
  User,
  GraduationCap,
  FileText,
  UploadCloud,
  CheckCircle,
  X,
  Plus,
  Link as LinkIcon,
  Github,
  Linkedin,
  Globe,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const POPULAR_SKILL_SUGGESTIONS = [
  'React', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 'Java', 'SQL',
  'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Git', 'TailwindCSS', 'Figma', 'REST API'
];

const StudentProfile = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [toasts, setToasts] = useState([]);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    university: '',
    educationLevel: 'Bachelor',
    graduationYear: 2026,
    major: '',
    gpa: '',
    bio: '',
    skills: [],
    location: '',
    github: '',
    linkedin: '',
    portfolio: '',
  });

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await studentAPI.getProfile();
        if (res.data.success && res.data.profile) {
          const p = res.data.profile;
          setProfile(p);
          setFormData({
            name: p.user?.name || user?.name || '',
            phone: p.phone || '',
            university: p.university || '',
            educationLevel: p.educationLevel || 'Bachelor',
            graduationYear: p.graduationYear || 2026,
            major: p.major || '',
            gpa: p.gpa || '',
            bio: p.bio || '',
            skills: p.skills || [],
            location: p.location || '',
            github: p.github || '',
            linkedin: p.linkedin || '',
            portfolio: p.portfolio || '',
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        addToast('Failed to load profile data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || skillInput).trim();
    if (!trimmed) return;

    if (!formData.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
      }));
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleKeyDownSkill = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      addToast('Only PDF resume files are accepted.', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('File size must be 5MB or less.', 'error');
      return;
    }

    const uploadForm = new FormData();
    uploadForm.append('resume', file);

    try {
      setUploading(true);
      const res = await studentAPI.uploadResume(uploadForm);
      if (res.data.success) {
        setProfile((prev) => ({
          ...prev,
          resumeUrl: res.data.resume.url,
          resumeOriginalName: res.data.resume.originalName,
          resumeUploadedAt: res.data.resume.uploadedAt,
        }));
        await refreshUser();
        addToast('Resume uploaded and processed successfully!');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Resume upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await studentAPI.updateProfile(formData);
      if (res.data.success) {
        await refreshUser();
        addToast('Student profile updated successfully!');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Student Profile">
        <LoadingSpinner message="Loading profile..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Profile & Professional Credentials"
      subtitle="Manage your contact details, education, technical skills, and PDF resume."
    >
      <Toast toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Section 1: Basic Information */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--navy-900)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} color="var(--sky-600)" /> Personal Information
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                required
                className="form-input"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read Only)</label>
              <input
                type="email"
                disabled
                className="form-input"
                value={user?.email || ''}
                style={{ backgroundColor: 'var(--bg-secondary)', cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="phone"
                className="form-input"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">City, State / Location</label>
              <input
                type="text"
                name="location"
                className="form-input"
                placeholder="San Francisco, CA or Remote"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
            <label className="form-label">Professional Summary / Bio</label>
            <textarea
              name="bio"
              rows={3}
              className="form-textarea"
              placeholder="Tell hiring managers about your career interests, academic achievements, and projects..."
              value={formData.bio}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Section 2: Education */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--navy-900)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GraduationCap size={20} color="var(--sky-600)" /> Education & Academics
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">University / College</label>
              <input
                type="text"
                name="university"
                className="form-input"
                placeholder="Tech State University"
                value={formData.university}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Degree Level</label>
              <select
                name="educationLevel"
                className="form-select"
                value={formData.educationLevel}
                onChange={handleChange}
              >
                <option value="Bachelor">Bachelor of Science / Arts</option>
                <option value="Master">Master of Science / Arts</option>
                <option value="PhD">Doctorate / PhD</option>
                <option value="Associate">Associate Degree</option>
                <option value="Bootcamp">Coding Bootcamp Graduate</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Major / Field of Study</label>
              <input
                type="text"
                name="major"
                className="form-input"
                placeholder="Computer Science, Data Science, etc."
                value={formData.major}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Graduation Year</label>
              <input
                type="number"
                name="graduationYear"
                min="2020"
                max="2035"
                className="form-input"
                value={formData.graduationYear}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cumulative GPA</label>
              <input
                type="text"
                name="gpa"
                className="form-input"
                placeholder="3.85 / 4.0"
                value={formData.gpa}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Technical & Professional Skills */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--navy-900)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color="var(--sky-600)" /> Skill Portfolio ({formData.skills.length})
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Used by AI matching algorithm to calculate internship recommendations
            </span>
          </div>

          {/* Skill Input */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Type a skill and press Enter (e.g. React, Python, Docker)..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleKeyDownSkill}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => handleAddSkill()}
            >
              <Plus size={16} /> Add
            </button>
          </div>

          {/* Active Skills Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem', minHeight: 40 }}>
            {formData.skills.map((skill, idx) => (
              <span key={idx} className="skill-tag" style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}>
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: 4, color: 'var(--navy-600)' }}
                  aria-label={`Remove skill ${skill}`}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            {formData.skills.length === 0 && (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic' }}>
                No skills added yet. Add your core tools below or type them above.
              </span>
            )}
          </div>

          {/* Recommended Quick-Add Chips */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              + Quick Add In-Demand Skills
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {POPULAR_SKILL_SUGGESTIONS.filter((s) => !formData.skills.includes(s)).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleAddSkill(skill)}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--navy-700)',
                    border: '1px solid var(--border)',
                    fontSize: '0.8rem',
                    padding: '0.25rem 0.65rem',
                  }}
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: PDF Resume Upload */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--navy-900)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="var(--sky-600)" /> Official PDF Resume
            </h2>
            {profile?.resumeUrl && (
              <Link to="/resume-analyzer" className="btn btn-secondary btn-sm">
                <Sparkles size={14} color="#0284c7" /> Run ATS Resume Diagnostic
              </Link>
            )}
          </div>

          {profile?.resumeUrl ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem',
                backgroundColor: 'var(--sky-50)',
                border: '1px solid var(--sky-200)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    backgroundColor: 'var(--sky-600)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FileText size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>
                    {profile.resumeOriginalName || 'Resume.pdf'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Uploaded: {new Date(profile.resumeUploadedAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  Download / View PDF
                </a>
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--warning-bg)',
                border: '1px solid var(--warning-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                color: '#92400e',
                marginBottom: '1.5rem',
              }}
            >
              ⚠️ You have not uploaded a PDF resume yet. A resume is required to apply for internships.
            </div>
          )}

          {/* Upload Input */}
          <div className="upload-dropzone">
            <input
              type="file"
              id="resume-file-input"
              accept=".pdf,application/pdf"
              onChange={handleResumeUpload}
              style={{ display: 'none' }}
              disabled={uploading}
            />
            <label
              htmlFor="resume-file-input"
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
            >
              <UploadCloud size={40} color="var(--sky-600)" />
              <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>
                {uploading ? 'Processing & Extracting PDF...' : 'Click to Upload or Replace PDF Resume'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                PDF format only. Maximum file size: 5 MB.
              </div>
            </label>
          </div>
        </div>

        {/* Section 5: Web & Portfolio Links */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--navy-900)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LinkIcon size={20} color="var(--sky-600)" /> Links & Portfolio
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="url"
                  name="github"
                  className="form-input"
                  placeholder="https://github.com/username"
                  value={formData.github}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Github size={18} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">LinkedIn URL</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="url"
                  name="linkedin"
                  className="form-input"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedin}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Linkedin size={18} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Personal Portfolio / Website</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="url"
                  name="portfolio"
                  className="form-input"
                  placeholder="https://yourname.dev"
                  value={formData.portfolio}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Globe size={18} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '2rem' }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            {saving ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default StudentProfile;

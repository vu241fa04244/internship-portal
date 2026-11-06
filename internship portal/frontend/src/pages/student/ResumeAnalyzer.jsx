import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { aiAPI } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Toast from '../../components/common/Toast';
import {
  FileText,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Award,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ResumeAnalyzer = () => {
  const { user } = useAuth();
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [tabMode, setTabMode] = useState('profile'); // 'profile', 'upload', 'text'
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleAnalyzeProfileResume = async () => {
    if (!user?.profile?.resumeUrl) {
      addToast('No resume found on your profile. Please upload one below or in your profile.', 'error');
      setTabMode('upload');
      return;
    }

    try {
      setAnalyzing(true);
      const res = await aiAPI.analyzeResume({});
      if (res.data.success) {
        setAnalysis(res.data.analysis);
        addToast('Resume analysis complete!');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to analyze resume.', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      addToast('Please upload a PDF document.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setAnalyzing(true);
      const res = await aiAPI.analyzeResume(formData);
      if (res.data.success) {
        setAnalysis(res.data.analysis);
        addToast('PDF resume parsed and evaluated!');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to analyze uploaded PDF.', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAnalyzeText = async () => {
    if (!pastedText.trim() || pastedText.trim().length < 50) {
      addToast('Please paste at least 50 characters of resume text to evaluate.', 'error');
      return;
    }

    try {
      setAnalyzing(true);
      const res = await aiAPI.analyzeResume({ text: pastedText.trim() });
      if (res.data.success) {
        setAnalysis(res.data.analysis);
        addToast('Resume text analyzed successfully!');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to analyze resume text.', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  // Helper for circular stroke dashoffset
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 65) return '#0284c7';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <DashboardLayout
      title="AI & ATS Resume Diagnostics"
      subtitle="Benchmark your PDF resume against applicant tracking systems and modern engineering recruiters."
    >
      <Toast toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />

      {/* Input Selector Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => setTabMode('profile')}
            style={{
              backgroundColor: tabMode === 'profile' ? 'var(--navy-900)' : 'var(--bg-secondary)',
              color: tabMode === 'profile' ? '#ffffff' : 'var(--navy-800)',
              fontWeight: 600,
            }}
          >
            <FileText size={16} /> Analyze Saved Profile Resume
          </button>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => setTabMode('upload')}
            style={{
              backgroundColor: tabMode === 'upload' ? 'var(--navy-900)' : 'var(--bg-secondary)',
              color: tabMode === 'upload' ? '#ffffff' : 'var(--navy-800)',
              fontWeight: 600,
            }}
          >
            <UploadCloud size={16} /> Upload New PDF File
          </button>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => setTabMode('text')}
            style={{
              backgroundColor: tabMode === 'text' ? 'var(--navy-900)' : 'var(--bg-secondary)',
              color: tabMode === 'text' ? '#ffffff' : 'var(--navy-800)',
              fontWeight: 600,
            }}
          >
            <Sparkles size={16} /> Paste Resume Text
          </button>
        </div>

        {tabMode === 'profile' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--navy-900)', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                Active Profile Resume: {user?.profile?.resumeOriginalName || 'Not uploaded yet'}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Run automated extraction and ATS compatibility evaluation on your current resume.
              </p>
            </div>
            <button
              onClick={handleAnalyzeProfileResume}
              className="btn btn-primary"
              disabled={analyzing || !user?.profile?.resumeUrl}
            >
              {analyzing ? 'Extracting & Analyzing...' : 'Run Diagnostics'}
            </button>
          </div>
        )}

        {tabMode === 'upload' && (
          <div className="upload-dropzone">
            <input
              type="file"
              id="analyze-file-input"
              accept=".pdf,application/pdf"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              disabled={analyzing}
            />
            <label
              htmlFor="analyze-file-input"
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
            >
              <UploadCloud size={44} color="var(--sky-600)" />
              <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>
                {analyzing ? 'Reading PDF and evaluating...' : 'Click to select a PDF resume to analyze'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                PDF format only (Max 5MB). Instant text extraction & scoring.
              </div>
            </label>
          </div>
        )}

        {tabMode === 'text' && (
          <div>
            <textarea
              rows={6}
              className="form-textarea"
              placeholder="Paste the raw text of your resume here to test keywords, skills, and section headers..."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              style={{ marginBottom: '1rem' }}
            />
            <button
              onClick={handleAnalyzeText}
              className="btn btn-primary"
              disabled={analyzing}
            >
              {analyzing ? 'Evaluating Text...' : 'Analyze Pasted Text'}
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {analyzing && (
        <div style={{ margin: '3rem 0' }}>
          <LoadingSpinner message="Extracting text, checking ATS headers, and computing skill score..." />
        </div>
      )}

      {/* Analysis Results Display */}
      {analysis && !analyzing && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Top Score Banner */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '320px 1fr',
              gap: '2rem',
              alignItems: 'stretch',
            }}
          >
            {/* Score Gauge Box */}
            <div className="score-gauge-box">
              <div style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '1rem' }}>
                Overall Resume Score
              </div>

              <div className="score-circle-wrapper">
                <svg className="score-circle-svg" width="140" height="140" viewBox="0 0 140 140">
                  <circle className="score-circle-bg" cx="70" cy="70" r="58" />
                  <circle
                    className="score-circle-val"
                    cx="70"
                    cy="70"
                    r="58"
                    style={{
                      strokeDasharray: 364,
                      strokeDashoffset: 364 - (364 * analysis.score) / 100,
                      stroke: getScoreColor(analysis.score),
                    }}
                  />
                </svg>
                <div className="score-number" style={{ color: getScoreColor(analysis.score) }}>
                  {analysis.score}
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                ATS Compatibility:{' '}
                <strong style={{ color: '#ffffff' }}>{analysis.atsCompatibility?.status || 'Good'}</strong>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                Evaluated by: {analysis.providerUsed}
              </div>
            </div>

            {/* Score Breakdown Bars */}
            <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-900)', marginBottom: '1.25rem' }}>
                Transparent Scoring Criteria Breakdown
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--navy-800)' }}>Contact & Professional Links</span>
                    <span style={{ color: 'var(--text-muted)' }}>{analysis.scoreBreakdown?.contactInfo} / 15 pts</span>
                  </div>
                  <div style={{ height: 8, backgroundColor: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${((analysis.scoreBreakdown?.contactInfo || 0) / 15) * 100}%`, backgroundColor: 'var(--sky-600)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--navy-800)' }}>Education & Degree Information</span>
                    <span style={{ color: 'var(--text-muted)' }}>{analysis.scoreBreakdown?.education} / 15 pts</span>
                  </div>
                  <div style={{ height: 8, backgroundColor: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${((analysis.scoreBreakdown?.education || 0) / 15) * 100}%`, backgroundColor: 'var(--sky-600)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--navy-800)' }}>Technical Skills Diversity & Breadth</span>
                    <span style={{ color: 'var(--text-muted)' }}>{analysis.scoreBreakdown?.skillsScore} / 30 pts</span>
                  </div>
                  <div style={{ height: 8, backgroundColor: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${((analysis.scoreBreakdown?.skillsScore || 0) / 30) * 100}%`, backgroundColor: 'var(--sky-600)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--navy-800)' }}>Projects, Experience & Action Verbs</span>
                    <span style={{ color: 'var(--text-muted)' }}>{analysis.scoreBreakdown?.experience} / 25 pts</span>
                  </div>
                  <div style={{ height: 8, backgroundColor: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${((analysis.scoreBreakdown?.experience || 0) / 25) * 100}%`, backgroundColor: 'var(--sky-600)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--navy-800)' }}>ATS Formatting & Structure</span>
                    <span style={{ color: 'var(--text-muted)' }}>{analysis.scoreBreakdown?.formatting} / 15 pts</span>
                  </div>
                  <div style={{ height: 8, backgroundColor: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${((analysis.scoreBreakdown?.formatting || 0) / 15) * 100}%`, backgroundColor: 'var(--sky-600)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Identified vs Missing Skills Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
            {/* Identified Skills */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#065f46', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={20} color="#10b981" /> Identified Skills ({analysis.identifiedSkills?.length || 0})
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {analysis.identifiedSkills?.map((skill, index) => (
                  <span key={index} className="skill-tag skill-tag-matched">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended High-Demand Skills */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#b45309', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={20} color="#f59e0b" /> In-Demand Skills to Add
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {analysis.missingSkills?.map((skill, index) => (
                  <span key={index} className="skill-tag skill-tag-missing">
                    + {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Strengths & Actionable Recommendations */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
            {/* Strengths */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={20} color="var(--sky-600)" /> Key Strengths
              </h3>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--navy-800)', lineHeight: 1.7, fontSize: '0.925rem' }}>
                {analysis.strengths?.map((str, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem' }}>{str}</li>
                ))}
              </ul>
            </div>

            {/* Suggestions */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={20} color="#0284c7" /> Actionable Improvements
              </h3>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--navy-800)', lineHeight: 1.7, fontSize: '0.925rem' }}>
                {analysis.suggestions?.map((sug, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem' }}>{sug}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Legal Advisory Disclaimer */}
          <div
            style={{
              padding: '1rem 1.5rem',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              display: 'flex',
              gap: '0.75rem',
            }}
          >
            <ShieldCheck size={20} style={{ flexShrink: 0, color: 'var(--navy-600)' }} />
            <div>
              <strong>Advisory Transparency Disclaimer:</strong> {analysis.disclaimer || 'SkillBridge AI analysis is advisory and provided for student guidance only. Scores do not guarantee interview selection or job offers.'}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ResumeAnalyzer;

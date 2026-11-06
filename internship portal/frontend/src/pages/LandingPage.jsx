import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Briefcase,
  FileCheck,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Shield,
  Award,
  Users,
  Search,
} from 'lucide-react';
import { internshipAPI } from '../services/api';
import InternshipCard from '../components/cards/InternshipCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const LandingPage = () => {
  const [featuredInternships, setFeaturedInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await internshipAPI.getAll({ limit: 4 });
        if (res.data.success) {
          setFeaturedInternships(res.data.internships || []);
        }
      } catch (err) {
        console.warn('Could not load featured internships:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #090d16 0%, #0f172a 60%, #1e3a8a 100%)',
          color: '#ffffff',
          padding: '5rem 0 4.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: 840, margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#38bdf8',
                marginBottom: '1.5rem',
              }}
            >
              <Sparkles size={16} /> Intelligent Career Discovery Platform
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.3rem, 5vw, 3.8rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#ffffff',
                marginBottom: '1.25rem',
                letterSpacing: '-0.02em',
              }}
            >
              Bridge the Gap Between Your <span style={{ color: '#38bdf8' }}>Skills</span> & Dream <span style={{ color: '#38bdf8' }}>Internships</span>
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: '#cbd5e1',
                lineHeight: 1.6,
                marginBottom: '2.5rem',
                maxWidth: 720,
                margin: '0 auto 2.5rem',
              }}
            >
              SkillBridge analyzes your skills, evaluates your PDF resume with ATS benchmarks, and connects you directly with vetted engineering, data, design, and business opportunities.
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <Link to="/internships" className="btn btn-primary btn-lg">
                <Search size={18} />
                <span>Explore Internships</span>
              </Link>
              <Link to="/resume-analyzer" className="btn btn-secondary btn-lg">
                <FileCheck size={18} />
                <span>Analyze Your Resume Free</span>
              </Link>
            </div>

            {/* Quick value props pill row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.75rem',
                marginTop: '3.5rem',
                flexWrap: 'wrap',
                fontSize: '0.875rem',
                color: '#94a3b8',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="#38bdf8" /> 100% Free for Students
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="#38bdf8" /> Real-time Application Tracking
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="#38bdf8" /> Deterministic AI Matching
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--border)',
          padding: '2.5rem 0',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              textAlign: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--navy-900)' }}>8+</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>High-Growth Categories</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0284c7' }}>100%</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Skill Matching Transparency</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--navy-900)' }}>ATS</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Automated Resume Diagnostics</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981' }}>24/7</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Application Status Alerts</div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Feature Cards */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 650, margin: '0 auto 3.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--navy-900)', marginBottom: '0.75rem' }}>
              Engineered to Accelerate Student Careers
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
              Built for ambitious students who want transparent skill benchmarks, verified internship listings, and instant application feedback.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {/* Feature 1 */}
            <div className="card" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: 'var(--sky-100)',
                  color: 'var(--sky-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--navy-900)' }}>
                Deterministic Skill Matching
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                Our algorithm standardizes technical aliases (e.g. React.js, Node, Docker) and calculates exact percentage scores with breakdown lists of your matched and missing skills.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: '#ecfdf5',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <FileCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--navy-900)' }}>
                ATS Resume Diagnostics
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                Upload your PDF resume to receive a comprehensive ATS compatibility breakdown, detecting contact links, project action verbs, quantifiable metrics, and missing high-demand tools.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: '#fffbeb',
                  color: '#f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <TrendingUp size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--navy-900)' }}>
                One-Click Application Tracking
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                Apply once with your saved profile and resume. Track your status through Pending, Shortlisted, Accepted, or Rejected with automatic email-style alerts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Internships Preview */}
      <section style={{ padding: '4.5rem 0 5rem', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--navy-900)' }}>Featured Opportunities</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                Explore recently posted student internships with verified stipends and deadlines.
              </p>
            </div>
            <Link to="/internships" className="btn btn-outline-sky">
              <span>View All Internships</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading live internship opportunities..." />
          ) : (
            <div className="internship-cards-list">
              {featuredInternships.map((internship) => (
                <InternshipCard key={internship._id} internship={internship} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 3.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
              How SkillBridge Works
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>Simple, transparent steps to land your next internship</p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '2rem',
            }}
          >
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: 'var(--navy-900)',
                  color: '#ffffff',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                Create Student Profile
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Add your degree, university, GPA, and tags for your technical and soft skills.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: 'var(--sky-600)',
                  color: '#ffffff',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                Upload & Analyze Resume
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Upload your PDF resume to extract key skills and review ATS score recommendations.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                Apply & Track Status
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Explore AI recommended internships, apply in 1-click, and track review status.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, var(--navy-950) 0%, var(--navy-900) 100%)',
              borderRadius: 'var(--radius-lg)',
              padding: '4rem 2rem',
              textAlign: 'center',
              color: '#ffffff',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <h2 style={{ fontSize: '2.4rem', color: '#ffffff', marginBottom: '1rem' }}>
              Ready to Advance Your Tech Career?
            </h2>
            <p style={{ color: '#cbd5e1', maxWidth: 600, margin: '0 auto 2rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Join SkillBridge today to discover internships with transparent skill matching and boost your resume with automated ATS insights.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg">
                Create Free Student Account
              </Link>
              <Link to="/internships" className="btn btn-secondary btn-lg">
                Browse Active Roles
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

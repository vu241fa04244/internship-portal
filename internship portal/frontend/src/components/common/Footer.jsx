import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart, Shield, Cpu, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#0f172a',
        color: '#94a3b8',
        borderTop: '1px solid #1e293b',
        marginTop: 'auto',
        padding: '3.5rem 0 2rem',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Briefcase size={18} color="#38bdf8" />
              </div>
              <span style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>
                SkillBridge
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#94a3b8' }}>
              SkillBridge is an AI-powered student internship & career opportunity platform engineered to connect students with high-impact internships through transparent skill matching and automated ATS resume analytics.
            </p>
          </div>

          {/* Student Hub */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '1rem' }}>Student Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/internships" style={{ color: '#cbd5e1' }}>
                  Explore Opportunities
                </Link>
              </li>
              <li>
                <Link to="/recommendations" style={{ color: '#cbd5e1' }}>
                  Skill-Based Recommendations
                </Link>
              </li>
              <li>
                <Link to="/resume-analyzer" style={{ color: '#cbd5e1' }}>
                  ATS Resume Analyzer
                </Link>
              </li>
              <li>
                <Link to="/register" style={{ color: '#cbd5e1' }}>
                  Create Student Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech & Intelligence */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '1rem' }}>Architecture</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Cpu size={14} color="#38bdf8" /> Full-Stack MERN Architecture
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={14} color="#38bdf8" /> Deterministic Skill Engine
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Shield size={14} color="#38bdf8" /> Role-Based Access Control (RBAC)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Briefcase size={14} color="#38bdf8" /> PDF Parsing & Extraction
              </li>
            </ul>
          </div>

          {/* Advisory & Security */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '1rem' }}>Transparency</h4>
            <p style={{ fontSize: '0.8rem', lineHeight: 1.5, color: '#64748b' }}>
              All recommendations and resume evaluations are calculated using transparent, deterministic skill benchmarks. Match scores are guidance metrics and do not guarantee interview or employment offers.
            </p>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid #1e293b',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.825rem',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} SkillBridge Portal. Built for Academic & Production Excellence.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span>MongoDB Atlas</span>
            <span>Express.js</span>
            <span>React & Vite</span>
            <span>Node.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

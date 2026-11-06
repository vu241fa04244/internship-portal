import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Briefcase } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 150px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 480 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            backgroundColor: 'var(--sky-50)',
            color: 'var(--sky-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <Compass size={36} />
        </div>

        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--navy-900)', lineHeight: 1 }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--navy-800)', marginTop: '0.5rem', marginBottom: '1rem' }}>
          Page Not Found
        </h2>

        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
          The page you are looking for does not exist or may have been relocated. Use the links below to return to safety.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={18} /> Return Home
          </Link>
          <Link to="/internships" className="btn btn-secondary">
            <Briefcase size={18} /> Browse Internships
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

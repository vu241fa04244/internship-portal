import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, Shield, User } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);
      // Redirect based on role
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Login failed. Please verify credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      <div className="card" style={{ width: '100%', maxWidth: 460, padding: '2.5rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: 'var(--navy-900)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <Briefcase size={26} />
          </div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--navy-900)', marginBottom: '0.35rem' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sign in to access your SkillBridge dashboard
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div
            style={{
              backgroundColor: 'var(--danger-bg)',
              border: '1px solid var(--danger-border)',
              color: '#991b1b',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Demo Fast Login Pills */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
              marginBottom: '0.65rem',
              textAlign: 'center',
            }}
          >
            ⚡ Quick Demo Logins
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setDemoCredentials('alex.rivera@student.edu', 'Student@123456')}
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.2rem' }}
            >
              <User size={12} /> Student 1
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setDemoCredentials('priya.sharma@student.edu', 'Student@123456')}
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.2rem' }}
            >
              <User size={12} /> Student 2
            </button>
            <button
              type="button"
              className="btn btn-navy btn-sm"
              onClick={() => setDemoCredentials('admin@skillbridge.dev', 'Admin@123456')}
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.2rem' }}
            >
              <Shield size={12} color="#38bdf8" /> Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-email"
                type="email"
                required
                className="form-input"
                placeholder="name@student.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail
                size={18}
                color="#94a3b8"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="login-password">
                Password
              </label>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              />
              <Lock
                size={18}
                color="#94a3b8"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem' }}
            disabled={loading}
          >
            {loading ? (
              'Authenticating...'
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border)',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
          }}
        >
          Don't have an account yet?{' '}
          <Link to="/register" style={{ fontWeight: 600, color: 'var(--sky-600)' }}>
            Register as a Student
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

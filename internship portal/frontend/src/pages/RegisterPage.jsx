import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Evaluate password strength
  const getPasswordStrength = () => {
    if (!password) return { label: '', color: '', percent: 0 };
    if (password.length < 6) return { label: 'Too short (min 6 chars)', color: '#ef4444', percent: 25 };

    let score = 1;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score >= 4) return { label: 'Strong password', color: '#10b981', percent: 100 };
    if (score >= 3) return { label: 'Good password', color: '#0284c7', percent: 75 };
    return { label: 'Fair password', color: '#f59e0b', percent: 50 };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
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
      <div className="card" style={{ width: '100%', maxWidth: 500, padding: '2.5rem' }}>
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
            Create Student Account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Get AI-recommended internships and automated resume analysis
          </p>
        </div>

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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-name"
                type="text"
                required
                className="form-input"
                placeholder="Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <User
                size={18}
                color="#94a3b8"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">
              Student Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-email"
                type="email"
                required
                className="form-input"
                placeholder="alex.rivera@university.edu"
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
            <label className="form-label" htmlFor="reg-password">
              Password (min. 6 characters)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-password"
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

            {/* Password strength bar */}
            {password && (
              <div style={{ marginTop: '0.4rem' }}>
                <div
                  style={{
                    height: 4,
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${strength.percent}%`,
                      backgroundColor: strength.color,
                      transition: 'width 0.2s',
                    }}
                  />
                </div>
                <div style={{ fontSize: '0.75rem', color: strength.color, marginTop: '0.2rem' }}>
                  {strength.label}
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm-password">
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-confirm-password"
                type={showPassword ? 'text' : 'password'}
                required
                className="form-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock
                size={18}
                color="#94a3b8"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          {/* Security policy note */}
          <div
            style={{
              backgroundColor: 'var(--sky-50)',
              border: '1px solid var(--sky-200)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              color: 'var(--sky-900)',
              marginBottom: '1.25rem',
              display: 'flex',
              gap: '0.5rem',
            }}
          >
            <ShieldCheck size={18} style={{ flexShrink: 0, color: 'var(--sky-600)' }} />
            <span>
              Public registration registers you as a verified <strong>Student</strong>. Administrator accounts are provisioned securely via backend administrative tooling.
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? (
              'Creating Student Account...'
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

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
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: 'var(--sky-600)' }}>
            Log In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { aiAPI } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import InternshipCard from '../../components/cards/InternshipCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Sparkles, CheckCircle, Plus, Info, Briefcase, User } from 'lucide-react';

const AIRecommendations = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disclaimer, setDisclaimer] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const res = await aiAPI.getRecommendations();
        if (res.data.success) {
          setRecommendations(res.data.recommendations || []);
          setDisclaimer(res.data.disclaimer || '');
        }
      } catch (err) {
        console.error('Failed to load recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  const studentSkills = user?.profile?.skills || [];

  if (loading) {
    return (
      <DashboardLayout title="AI Skill Recommendations">
        <LoadingSpinner message="Calculating deterministic skill match scores for active internships..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Intelligent Skill-Based Recommendations"
      subtitle="Internships ranked deterministically by comparing your verified skills with required job competencies."
      action={
        <Link to="/profile" className="btn btn-secondary btn-sm">
          <User size={16} /> Edit My Skills ({studentSkills.length})
        </Link>
      }
    >
      {/* Student Skills Context Pill Box */}
      <div
        className="card"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          backgroundColor: '#ffffff',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--navy-800)' }}>
            Your Profile Skills Used for Matching:
          </span>
          <Link to="/profile" style={{ fontSize: '0.8rem', color: 'var(--sky-600)', fontWeight: 600 }}>
            + Manage Skills in Profile
          </Link>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {studentSkills.map((skill, i) => (
            <span key={i} className="skill-tag skill-tag-matched">
              <CheckCircle size={12} /> {skill}
            </span>
          ))}
          {studentSkills.length === 0 && (
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No skills listed. Please add skills to your profile to get personalized recommendations!
            </span>
          )}
        </div>
      </div>

      {/* Advisory Banner */}
      <div
        style={{
          padding: '0.85rem 1.25rem',
          backgroundColor: 'var(--sky-50)',
          border: '1px solid var(--sky-200)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.825rem',
          color: 'var(--sky-900)',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
        }}
      >
        <Info size={18} color="var(--sky-600)" style={{ flexShrink: 0 }} />
        <span>
          {disclaimer || 'Skill-based recommendation only. Match scores evaluate technical overlap and do not guarantee selection or interview invitations.'}
        </span>
      </div>

      {/* Recommendations List */}
      {recommendations.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No recommendations found"
          description={
            studentSkills.length === 0
              ? 'Add your technical and professional skills to your profile to generate match recommendations.'
              : 'No active internships currently match your skill tags. Check back soon or explore all listings.'
          }
          action={
            studentSkills.length === 0 ? (
              <Link to="/profile" className="btn btn-primary btn-sm">
                Add Skills to Profile
              </Link>
            ) : (
              <Link to="/internships" className="btn btn-primary btn-sm">
                Browse All Internships
              </Link>
            )
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {recommendations.map((internship) => (
            <InternshipCard
              key={internship._id}
              internship={internship}
              showMatch={true}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AIRecommendations;

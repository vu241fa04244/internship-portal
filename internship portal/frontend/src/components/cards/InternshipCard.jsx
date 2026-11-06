import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Calendar,
  DollarSign,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const InternshipCard = ({ internship, showMatch = true }) => {
  if (!internship) return null;

  const {
    _id,
    title,
    company,
    location,
    workType,
    category,
    duration,
    stipend,
    currency = 'USD',
    deadline,
    skillsRequired = [],
    skillMatch,
    hasApplied,
  } = internship;

  const matchPercentage = skillMatch?.matchPercentage;
  const isExpired = new Date(deadline) < new Date();

  return (
    <article className="internship-card">
      <div className="internship-card-header">
        <div className="company-logo-box">
          {company ? company.charAt(0).toUpperCase() : 'C'}
        </div>

        <div className="internship-title-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <Link to={`/internships/${_id}`} className="internship-card-title">
              {title}
            </Link>
            {hasApplied && (
              <span className="badge badge-accepted" title="You have already applied">
                <CheckCircle size={12} /> Applied
              </span>
            )}
            {isExpired && (
              <span className="badge badge-rejected">Deadline Passed</span>
            )}
          </div>
          <p className="internship-company-name">{company}</p>
        </div>

        {/* Skill Match Badge */}
        {showMatch && matchPercentage !== undefined && (
          <div className="match-score-pill" title="AI Skill Match Percentage">
            <Sparkles size={13} /> {matchPercentage}% Match
          </div>
        )}
      </div>

      {/* Meta details */}
      <div className="internship-meta-row">
        <span className="meta-item">
          <MapPin size={15} color="#0284c7" /> {location} ({workType})
        </span>
        <span className="meta-item">
          <Clock size={15} color="#64748b" /> {duration}
        </span>
        <span className="meta-item">
          <Calendar size={15} color="#64748b" /> Deadline: {new Date(deadline).toLocaleDateString()}
        </span>
        <span className="badge badge-category">{category}</span>
      </div>

      {/* Skills */}
      <div className="internship-skills-row">
        {skillsRequired.slice(0, 5).map((skill, index) => {
          const isMatched = skillMatch?.matchedSkills?.some(
            (m) => m.toLowerCase() === skill.toLowerCase()
          );
          return (
            <span
              key={index}
              className={`skill-tag ${isMatched ? 'skill-tag-matched' : ''}`}
            >
              {isMatched && <CheckCircle size={12} />}
              {skill}
            </span>
          );
        })}
        {skillsRequired.length > 5 && (
          <span className="skill-tag" style={{ color: 'var(--text-muted)' }}>
            +{skillsRequired.length - 5} more
          </span>
        )}
      </div>

      {/* Card Footer */}
      <div className="internship-card-footer">
        <div className="stipend-text">
          {stipend > 0 ? (
            <>
              ${stipend.toLocaleString()}{' '}
              <span className="stipend-period">/ month ({currency})</span>
            </>
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Unpaid / Experience-based
            </span>
          )}
        </div>

        <Link to={`/internships/${_id}`} className="btn btn-secondary btn-sm">
          <span>View Details</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
};

export default InternshipCard;

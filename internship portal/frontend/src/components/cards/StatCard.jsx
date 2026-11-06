import React from 'react';

const StatCard = ({
  label,
  value,
  hint = '',
  icon: Icon,
  colorScheme = 'blue',
}) => {
  const schemeClasses = {
    blue: 'stat-icon-blue',
    emerald: 'stat-icon-emerald',
    amber: 'stat-icon-amber',
    purple: 'stat-icon-purple',
  };

  const iconClass = schemeClasses[colorScheme] || 'stat-icon-blue';

  return (
    <div className="stat-card">
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {hint && <span className="stat-hint">{hint}</span>}
      </div>
      {Icon && (
        <div className={`stat-icon-wrapper ${iconClass}`}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};

export default StatCard;

import React from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  Sparkles,
  Info,
  ArrowRight,
} from 'lucide-react';

const NotificationsPage = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotifications();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application_status':
        return <CheckCircle2 size={20} color="#10b981" />;
      case 'recommendation':
        return <Sparkles size={20} color="#0284c7" />;
      default:
        return <Info size={20} color="#64748b" />;
    }
  };

  return (
    <DashboardLayout
      title="Notifications & Alerts"
      subtitle="Stay updated on your application status changes and skill-matched opportunities."
      action={
        unreadCount > 0 ? (
          <button
            onClick={markAllAsRead}
            className="btn btn-secondary btn-sm"
          >
            <CheckCheck size={16} /> Mark All as Read
          </button>
        ) : null
      }
    >
      {loading ? (
        <LoadingSpinner message="Loading notifications..." />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="When you apply for internships or your status is reviewed, alerts will appear here."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {notifications.map((item) => (
            <div
              key={item._id}
              onClick={() => !item.isRead && markAsRead(item._id)}
              className="card"
              style={{
                padding: '1.25rem 1.5rem',
                backgroundColor: item.isRead ? '#ffffff' : 'var(--sky-50)',
                borderColor: item.isRead ? 'var(--border)' : 'var(--sky-200)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                cursor: item.isRead ? 'default' : 'pointer',
                transition: 'background-color 0.15s ease',
              }}
            >
              <div style={{ marginTop: '0.2rem' }}>
                {getNotificationIcon(item.type)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--navy-900)' }}>
                    {item.title}
                  </h4>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>

                <p style={{ color: 'var(--navy-700)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {item.message}
                </p>

                {item.link && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <Link
                      to={item.link}
                      style={{ fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      View related details <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>

              {!item.isRead && (
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'var(--sky-600)',
                    flexShrink: 0,
                    marginTop: '0.5rem',
                  }}
                  title="Unread notification"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default NotificationsPage;

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ toasts = [], onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((toast) => {
        let Icon = Info;
        let toastClass = 'toast-info';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          toastClass = 'toast-success';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          toastClass = 'toast-error';
        }

        return (
          <div key={toast.id} className={`toast ${toastClass}`} role="alert">
            <Icon size={20} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{toast.message}</span>
            {onDismiss && (
              <button
                onClick={() => onDismiss(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  opacity: 0.8,
                  padding: 2,
                }}
                aria-label="Dismiss notification"
              >
                <X size={16} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Toast;

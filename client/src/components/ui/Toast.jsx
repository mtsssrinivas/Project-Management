import React from 'react';
import { cn } from '@/utils/cn';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export function Toast({ id, type = 'info', title, message, onClose }) {
  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: 'text-status-success',
    error: 'text-status-danger',
    warning: 'text-status-warning',
    info: 'text-status-info',
  };

  const Icon = icons[type] || Info;

  return (
    <div
      className={cn(
        'flex items-start gap-3 w-80 rounded-md border border-border-subtle bg-surface p-3 shadow-popover',
        'animate-in slide-in-from-bottom-2 fade-in duration-200'
      )}
    >
      <Icon className={cn('w-4 h-4 shrink-0 mt-0.5', colors[type])} />
      <div className="flex-1 min-w-0">
        {title && <p className="text-xs font-semibold text-charcoal-900 leading-tight">{title}</p>}
        {message && <p className="text-2xs text-charcoal-500 mt-0.5 leading-normal">{message}</p>}
      </div>
      <button
        onClick={() => onClose(id)}
        className="text-charcoal-400 hover:text-charcoal-700 p-0.5 rounded transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onClose }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-auto">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}

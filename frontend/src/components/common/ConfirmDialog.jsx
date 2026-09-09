import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmLabel = 'Confirm',
  isDestructive = false,
  isLoading = false,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <AlertTriangle
        size={24}
        color={isDestructive ? 'var(--accent-red)' : 'var(--accent-amber)'}
        style={{ flexShrink: 0, marginTop: 2 }}
      />
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{message}</p>
    </div>
    <div className="form-actions">
      <button className="btn btn--ghost" onClick={onClose} disabled={isLoading}>
        Cancel
      </button>
      <button
        className={`btn ${isDestructive ? 'btn--danger' : 'btn--primary'}`}
        onClick={onConfirm}
        disabled={isLoading}
      >
        {isLoading ? <span className="spinner spinner--sm" /> : null}
        {confirmLabel}
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;

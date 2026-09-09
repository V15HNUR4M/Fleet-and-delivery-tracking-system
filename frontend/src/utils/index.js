import { format, formatDistanceToNow, isPast, parseISO } from 'date-fns';

// ─── Date helpers ─────────────────────────────────────────────────────────────

export const formatDateTime = (dt) => {
  if (!dt) return '—';
  try {
    return format(parseISO(dt), 'dd MMM yyyy, HH:mm');
  } catch {
    return dt;
  }
};

export const formatDate = (dt) => {
  if (!dt) return '—';
  try {
    return format(parseISO(dt), 'dd MMM yyyy');
  } catch {
    return dt;
  }
};

export const formatTimeAgo = (dt) => {
  if (!dt) return '—';
  try {
    return formatDistanceToNow(parseISO(dt), { addSuffix: true });
  } catch {
    return dt;
  }
};

export const isSlaBreached = (slaDeadline) => {
  if (!slaDeadline) return false;
  try {
    return isPast(parseISO(slaDeadline));
  } catch {
    return false;
  }
};

export const getSlaCountdown = (slaDeadline) => {
  if (!slaDeadline) return '—';
  try {
    const deadline = parseISO(slaDeadline);
    if (isPast(deadline)) return 'BREACHED';
    return formatDistanceToNow(deadline, { addSuffix: false }) + ' left';
  } catch {
    return '—';
  }
};

// ─── Error helpers ────────────────────────────────────────────────────────────

export const getErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred.';

  if (error.response) {
    const status = error.response.status;
    const detail = error.response.data?.detail;

    if (status === 401) return 'Your session has expired. Please sign in again.';
    if (status === 403) return 'You do not have permission to perform this action.';
    if (status === 404) return 'The requested resource was not found.';
    if (status === 409) return 'This operation conflicts with the current system state.';
    if (status === 400) return detail || 'The submitted data is invalid. Please check your inputs.';
    if (status >= 500) return 'Something went wrong on the server.';
    return detail || `Request failed with status ${status}.`;
  }

  if (error.request || error.code === 'ERR_NETWORK') {
    return 'Unable to connect to the backend. Make sure the backend server is running.';
  }

  return error?.message || 'An unexpected error occurred.';
};

// ─── String helpers ───────────────────────────────────────────────────────────

export const labelify = (value) => {
  if (!value) return '';
  return String(value)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export const truncate = (str, max = 40) => {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '…' : str;
};

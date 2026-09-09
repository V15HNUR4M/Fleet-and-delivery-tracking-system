import { format, formatDistanceToNow, isPast, parseISO } from 'date-fns';
import type { AxiosError } from 'axios';
import type { ApiError } from '../types';

// ─── Date helpers ─────────────────────────────────────────────────────────────

export const formatDateTime = (dt: string | null | undefined): string => {
  if (!dt) return '—';
  try {
    return format(parseISO(dt), 'dd MMM yyyy, HH:mm');
  } catch {
    return dt;
  }
};

export const formatDate = (dt: string | null | undefined): string => {
  if (!dt) return '—';
  try {
    return format(parseISO(dt), 'dd MMM yyyy');
  } catch {
    return dt;
  }
};

export const formatTimeAgo = (dt: string | null | undefined): string => {
  if (!dt) return '—';
  try {
    return formatDistanceToNow(parseISO(dt), { addSuffix: true });
  } catch {
    return dt;
  }
};

export const isSlaBreached = (slaDeadline: string | null | undefined): boolean => {
  if (!slaDeadline) return false;
  try {
    return isPast(parseISO(slaDeadline));
  } catch {
    return false;
  }
};

export const getSlaCountdown = (slaDeadline: string | null | undefined): string => {
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

export const getErrorMessage = (error: unknown): string => {
  if (!error) return 'An unexpected error occurred.';
  const axiosError = error as AxiosError<ApiError>;

  if (axiosError.response) {
    const status = axiosError.response.status;
    const detail = axiosError.response.data?.detail;

    if (status === 401) return 'Your session has expired. Please sign in again.';
    if (status === 403) return 'You do not have permission to perform this action.';
    if (status === 404) return 'The requested resource was not found.';
    if (status === 409) return 'This operation conflicts with the current system state.';
    if (status === 400) return detail || 'The submitted data is invalid. Please check your inputs.';
    if (status >= 500) return 'Something went wrong on the server.';
    return detail || `Request failed with status ${status}.`;
  }

  if (axiosError.request || (error as AxiosError).code === 'ERR_NETWORK') {
    return 'Unable to connect to the backend. Make sure the backend server is running.';
  }

  return (error as Error)?.message || 'An unexpected error occurred.';
};

// ─── String helpers ───────────────────────────────────────────────────────────

export const labelify = (value: string): string =>
  value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export const truncate = (str: string, max = 40): string =>
  str.length > max ? str.slice(0, max) + '…' : str;

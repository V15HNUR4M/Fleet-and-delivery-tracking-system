import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Activity, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { getErrorMessage } from '../../utils';
import { ROLES } from '../../constants';

type Tab = 'login' | 'register';

const LoginPage: React.FC = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const [tab, setTab] = useState<Tab>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showOtp, setShowOtp] = useState(false);

  // Login state
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');

  // Register state
  const [regMobile, setRegMobile] = useState('');
  const [regName, setRegName] = useState('');
  const [regRole, setRegRole] = useState('DISPATCHER');

  // Check for session_expired param
  const reason = new URLSearchParams(location.search).get('reason');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!mobile.trim()) { setError('Mobile number is required.'); return; }
    if (!otp.trim()) { setError('OTP is required.'); return; }
    setLoading(true);
    try {
      await login({ mobile: mobile.trim(), otp: otp.trim() });
      navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!regMobile.trim()) { setError('Mobile number is required.'); return; }
    if (!/^\d{10,15}$/.test(regMobile.trim())) { setError('Mobile must be 10–15 digits.'); return; }
    if (!regName.trim()) { setError('Name is required.'); return; }
    setLoading(true);
    try {
      await register({ mobile: regMobile.trim(), name: regName.trim(), role: regRole });
      setSuccess('Account registered! You can now log in with your OTP.');
      setTab('login');
      setMobile(regMobile.trim());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page" role="main">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <Activity size={24} color="#fff" />
          </div>
          <div>
            <div className="login-logo-name">FleetOps</div>
            <div className="login-logo-tagline">Fleet &amp; Delivery Tracking System</div>
          </div>
        </div>

        {/* Session expired warning */}
        {reason === 'session_expired' && !error && (
          <div className="login-error">
            Your session has expired. Please sign in again.
          </div>
        )}

        {/* Tabs */}
        <div className="login-tabs" role="tablist">
          <button
            className={`login-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError(''); setSuccess(''); }}
            role="tab"
            aria-selected={tab === 'login'}
            id="tab-login"
          >
            Sign In
          </button>
          <button
            className={`login-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setError(''); setSuccess(''); }}
            role="tab"
            aria-selected={tab === 'register'}
            id="tab-register"
          >
            Register
          </button>
        </div>

        {/* Alerts */}
        {error && <div className="login-error" role="alert">{error}</div>}
        {success && <div className="login-success" role="status">{success}</div>}

        {/* Login form */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} noValidate aria-labelledby="tab-login">
            <div className="form-group">
              <label className="form-label" htmlFor="login-mobile">
                Mobile Number <span className="required">*</span>
              </label>
              <input
                id="login-mobile"
                type="tel"
                className="form-input"
                placeholder="e.g. 9876543210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                autoComplete="tel"
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-otp">
                OTP <span className="required">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-otp"
                  type={showOtp ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  autoComplete="one-time-code"
                  style={{ paddingRight: 36 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOtp((s) => !s)}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text-muted)',
                    display: 'flex', alignItems: 'center',
                  }}
                  aria-label={showOtp ? 'Hide OTP' : 'Show OTP'}
                >
                  {showOtp ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <div className="form-hint">
                Use the OTP provided by the administrator.
              </div>
            </div>

            <button
              type="submit"
              className="btn btn--primary w-full"
              style={{ justifyContent: 'center', padding: '10px' }}
              disabled={loading}
            >
              {loading ? <><span className="spinner spinner--sm" /> Signing in…</> : 'Sign In'}
            </button>
          </form>
        )}

        {/* Register form */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} noValidate aria-labelledby="tab-register">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">
                Full Name <span className="required">*</span>
              </label>
              <input
                id="reg-name"
                type="text"
                className="form-input"
                placeholder="e.g. Rahul Sharma"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-mobile">
                Mobile Number <span className="required">*</span>
              </label>
              <input
                id="reg-mobile"
                type="tel"
                className="form-input"
                placeholder="10–15 digits"
                value={regMobile}
                onChange={(e) => setRegMobile(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-role">
                Role <span className="required">*</span>
              </label>
              <select
                id="reg-role"
                className="form-select"
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
                required
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="btn btn--primary w-full"
              style={{ justifyContent: 'center', padding: '10px' }}
              disabled={loading}
            >
              {loading ? <><span className="spinner spinner--sm" /> Registering…</> : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

export default LoginPage;

import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext.jsx';

const Register = () => {
  const navigate = useNavigate();
  const { backendURL } = useContext(AppContext);
  const apiBase = backendURL.endsWith('/api') ? backendURL : `${backendURL.replace(/\/$/, '')}/api`;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${apiBase}/auth/signup`, { name, email, password }, { withCredentials: true });
      toast.success('Account created. You can sign in now.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell auth-shell-register">
      <div className="auth-panel auth-panel-left">
        <div className="auth-copy">
          <div className="auth-kicker">02 / REGISTER</div>
          <h1>Create account.</h1>
          <p>New accounts join with the Member role.</p>

          <form className="auth-form" onSubmit={onSubmit}>
            <label>
              <span>Full name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                required
              />
            </label>

            <label>
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label>
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </label>

            <label>
              <span>Confirm password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </label>

            <button className="auth-button auth-button-dark" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            <div className="auth-links">
              <span>Already have an account?</span>{' '}
              <Link to="/login">Sign in</Link>
            </div>
          </form>
        </div>
      </div>
      <div className="auth-panel auth-panel-visual auth-visual-register" aria-hidden="true" />
    </div>
  );
};

export default Register;

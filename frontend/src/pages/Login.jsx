import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { backendURL, setIsLoggedIn, getUserData } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${backendURL}/auth/login`, { email, password });

      if (response.status === 200 && response.data?.token) {
        localStorage.setItem('jwt', response.data.token);
        setIsLoggedIn(true);
        const profile = await getUserData();
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        toast.error(response.data?.message || 'Invalid credentials');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell auth-shell-login">
      <div className="auth-panel auth-panel-left">
        <div className="auth-copy">
          <div className="auth-kicker">01 / SIGN IN</div>
          <h1>Welcome back.</h1>
          <p>Enter your credentials to continue.</p>

          <form className="auth-form" onSubmit={onSubmitHandler}>
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
                placeholder="Your password"
                autoComplete="current-password"
                required
              />
            </label>

            <button className="auth-button auth-button-dark" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="auth-links">
              <span>No account?</span>{' '}
              <Link to="/register">Create one</Link>
            </div>
          </form>

          <div className="auth-divider" />
          <div className="auth-note">
            Demo admin: admin@taskflow.com / admin123
          </div>
        </div>
      </div>
      <div className="auth-panel auth-panel-visual auth-visual-login" aria-hidden="true" />
    </div>
  );
};

export default Login;

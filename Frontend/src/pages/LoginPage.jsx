import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import { Mail, Lock } from 'lucide-react';
import GoogleIcon from '../components/GoogleIcon';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/'); // Redirect to home page on successful login
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Sign in to your account</h2>
          <p className="mt-2 text-(--text-color)/60">
            Or{' '}
            <Link to="/register" className="font-medium text-(--brand-color) hover:text-(--brand-color)/90">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {/* --- THIS IS THE CORRECTED SECTION --- */}
          <div className="space-y-4 rounded-md shadow-sm">
            {/* Email Input */}
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-(--text-color)/50" />
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-md border border-(--border-color) bg-(--surface-color) pl-10 pr-3 py-3 text-(--text-color) placeholder-(--placeholder-color) focus:border-(--brand-color) focus:outline-none focus:ring-(--brand-color) sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* Password Input */}
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-(--text-color)/50" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-md border border-(--border-color) bg-(--surface-color) pl-10 pr-3 py-3 text-(--text-color) placeholder-(--placeholder-color) focus:border-(--brand-color) focus:outline-none focus:ring-(--brand-color) sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {/* --- END OF CORRECTED SECTION --- */}

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-(--border-color)"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-(--bg-color) text-(--text-color)/60">Or continue with</span>
          </div>
        </div>

        <div>
          <a
            href={`${backendUrl}/api/v1/auth/google`}
            className="w-full inline-flex justify-center py-3 px-4 border border-(--border-color) rounded-md shadow-sm bg-(--surface-color) text-sm font-medium text-(--text-color) hover:bg-(--border-light) dark:hover:bg-(--border-dark) transition-colors"
          >
            <GoogleIcon />
            <span className="ml-3">Sign in with Google</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
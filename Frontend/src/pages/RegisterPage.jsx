import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import { Mail, Lock, User, Image as ImageIcon } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    avatar: null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, avatar: file });
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.avatar) {
      setError('Avatar image is required.');
      return;
    }
    setError('');
    setLoading(true);

    // Create a FormData object to send multipart data
    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('avatar', formData.avatar);

    try {
      await register(data);
      navigate('/login?registered=true'); // Redirect to login page with a success message
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Create a new account</h2>
          <p className="mt-2 text-(--text-color)/60">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-(--brand-color) hover:text-(--brand-color)/90">
              Sign in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Form Fields */}
            {/* ... (Full Name, Username, Email, Password inputs) */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-(--text-color)/50" />
              <input name="fullName" type="text" required className="w-full pl-10 pr-3 py-3 border border-(--border-color) bg-(--surface-color) rounded-md focus:outline-none focus:ring-(--brand-color) focus:border-(--brand-color) sm:text-sm" placeholder="Full Name" onChange={handleChange} />
            </div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-(--text-color)/50" />
              <input name="username" type="text" required className="w-full pl-10 pr-3 py-3 border border-(--border-color) bg-(--surface-color) rounded-md focus:outline-none focus:ring-(--brand-color) focus:border-(--brand-color) sm:text-sm" placeholder="Username" onChange={handleChange} />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-(--text-color)/50" />
              <input name="email" type="email" required className="w-full pl-10 pr-3 py-3 border border-(--border-color) bg-(--surface-color) rounded-md focus:outline-none focus:ring-(--brand-color) focus:border-(--brand-color) sm:text-sm" placeholder="Email address" onChange={handleChange} />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-(--text-color)/50" />
              <input name="password" type="password" required className="w-full pl-10 pr-3 py-3 border border-(--border-color) bg-(--surface-color) rounded-md focus:outline-none focus:ring-(--brand-color) focus:border-(--brand-color) sm:text-sm" placeholder="Password" onChange={handleChange} />
            </div>

            {/* Avatar Upload */}
            <div className="flex items-center space-x-4">
              <div className="shrink-0">
                {avatarPreview ? (
                  <img className="h-16 w-16 object-cover rounded-full" src={avatarPreview} alt="Current avatar" />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-(--border-light) dark:bg-(--border-dark) flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-(--text-color)/50" />
                  </div>
                )}
              </div>
              <label className="block">
                <span className="sr-only">Choose profile photo</span>
                <input type="file" name="avatar" onChange={handleFileChange} required className="block w-full text-sm text-(--text-color)/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-(--brand-color)/10 file:text-(--brand-color) hover:file:bg-(--brand-color)/20"/>
              </label>
            </div>
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
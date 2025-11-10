import { useState } from 'react';
import { changePassword } from '../../lib/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import toast from 'react-hot-toast'; // <-- IMPORT

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match.'); // <-- REPLACE
      return;
    }
    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.'); // <-- REPLACE
      return;
    }
    setIsLoading(true);
    try {
      await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });
      toast.success('Password changed successfully.'); // <-- REPLACE
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password.'); // <-- REPLACE
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Security</h2>
      <p className="text-sm text-(--text-color)/60 mb-6">Ensure your account is using a long, random password to stay secure.</p>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <Input label="Current Password" name="oldPassword" type="password" value={formData.oldPassword} onChange={handleChange} required />
        <Input label="New Password" name="newPassword" type="password" value={formData.newPassword} onChange={handleChange} required />
        <Input label="Confirm New Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
        <Button type="submit" disabled={isLoading}>{isLoading ? 'Updating...' : 'Update Password'}</Button>
      </form>
    </div>
  );
};
export default ChangePasswordPage;
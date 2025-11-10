import { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { updateAccountDetails, updateUserAvatar } from '../../lib/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { Camera } from 'lucide-react';
import toast from 'react-hot-toast'; // <-- IMPORT

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    username: user?.username || '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedUser = await updateAccountDetails({
        fullName: formData.fullName,
        email: formData.email
      });
      updateUser(updatedUser);
      toast.success('Profile updated successfully.'); // <-- REPLACE
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.'); // <-- REPLACE
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB.'); // <-- REPLACE
      return;
    }
    setIsUploading(true);
    const data = new FormData();
    data.append('avatar', file);
    try {
      const updatedUser = await updateUserAvatar(data);
      updateUser(updatedUser);
      toast.success('Avatar updated successfully.'); // <-- REPLACE
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload avatar.'); // <-- REPLACE
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Profile Details</h2>
      <div className="flex items-center gap-6 mb-8">
        <div className="relative group">
          <img src={user?.avatar} alt={user?.fullName} className="h-24 w-24 rounded-full object-cover border-2 border-(--border-color)" />
          <button type="button" onClick={() => fileInputRef.current.click()} className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" disabled={isUploading}>
            <Camera className="text-white h-8 w-8" />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
        <div>
          <p className="font-medium">Profile Picture</p>
          <p className="text-sm text-(--text-color)/60">{isUploading ? 'Uploading...' : 'Click image to upload. Max 5MB.'}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div>
          <label className="block text-sm font-medium text-(--text-color)/80 mb-1">Username</label>
          <input type="text" value={formData.username} disabled className="w-full px-3 py-2 border border-(--border-color) bg-(--bg-color) rounded-md text-(--text-color)/60 cursor-not-allowed" />
        </div>
        <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
        <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required />
        <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</Button>
      </form>
    </div>
  );
};
export default ProfilePage;
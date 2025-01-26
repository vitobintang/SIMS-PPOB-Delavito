import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { updateProfile, updateProfileImage, fetchProfile } from '../store/slices/profileSlice';
import { logout } from '../store/slices/authSlice';
import { Pencil, User, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Navigation from './Navigation';
import './Profile.css';

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.profile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
      });
    }
  }, [user]);

  // Fetch profile data when component mounts
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Format foto hanya boleh JPEG dan PNG');
      return;
    }

    // Validate file size (100kb = 100 * 1024 bytes)
    if (file.size > 100 * 1024) {
      toast.error('Ukuran foto harus kurang dari 100kb');
      return;
    }

    try {
      await dispatch(updateProfileImage(file)).unwrap();
    } catch (error) {
      // Error is handled in the slice
    }
  };

  const handleSave = async () => {
    const trimmedFirstName = formData.first_name.trim();
    const trimmedLastName = formData.last_name.trim();
    
    if (trimmedFirstName === user?.first_name.trim() && 
        trimmedLastName === user?.last_name.trim()) {
      toast.error('Tidak ada perubahan pada profil');
      return;
    }

    // Ensure the trimmed values are not empty
    if (!trimmedFirstName || !trimmedLastName) {
      toast.error('Nama tidak boleh kosong');
      return;
    }

    try {
      await dispatch(updateProfile({
        first_name: trimmedFirstName,
        last_name: trimmedLastName
      })).unwrap();
      toast.success('Profile telah diubah');
      setIsEditing(false);
    } catch (error) {
      // Error is handled in the slice
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      handleSave();
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="profileContainer">
        <div className="profileCard">
          <div className="profileImageContainer">
            <div className="imageWrapper">
              <img
                src={user?.profile_image || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="profileImage"
                onClick={handleImageClick}
              />
              <button onClick={handleImageClick} className="editButton">
                <Pencil className="editIcon" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg,image/png"
                onChange={handleImageChange}
              />
            </div>
            <h1 className="profileName">{`${user?.first_name} ${user?.last_name}`}</h1>
          </div>

          <form onSubmit={handleSubmit} className="formContainer">
            <div className="formGroup">
              <label className="inputLabel">Email</label>
              <div className="inputWrapper">
                <Mail className="inputIcon" />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input"
                />
              </div>
            </div>

            <div className="formGroup">
              <label className="inputLabel">Nama Depan</label>
              <div className="inputWrapper">
                <User className="inputIcon" />
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  disabled={!isEditing}
                  className="input"
                />
              </div>
            </div>

            <div className="formGroup">
              <label className="inputLabel">Nama Belakang</label>
              <div className="inputWrapper">
                <User className="inputIcon" />
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  disabled={!isEditing}
                  className="input"
                />
              </div>
            </div>

            <div className="buttonGroup">
              {isEditing ? (
                <>
                  <button type="button" onClick={handleSave} className="primaryButton">
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      if (user) {
                        setFormData({
                          first_name: user.first_name,
                          last_name: user.last_name,
                        });
                      }
                    }}
                    className="secondaryButton"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="primaryButton"
                  >
                    Edit Profil
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="secondaryButton"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { register } from '../store/slices/authSlice';
import { AtSign, Lock, User, Eye, EyeOff } from 'lucide-react';
import Logo from '../components/Logo';
import './Register.css';

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    password: '',
  });

  const validatePasswords = () => {
    if (formData.password !== formData.confirmPassword) {
      setErrors({ ...errors, password: 'password tidak sama' });
      return false;
    }
    setErrors({ ...errors, password: '' });
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswords()) return;

    try {
      await dispatch(register({
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password,
      })).unwrap();
      navigate('/login');
    } catch (error) {
      // Error is handled in the slice
    }
  };

  return (
    <div className="register-container">
      <div className="form-section">
        <div className="form-content">
          <div className="text-center">
            <div className="logo-title-wrapper">
              <Logo />
              <span className="app-title">SIMS PPOB</span>
            </div>
            <h2 className="title">
              Lengkapi data untuk membuat akun
            </h2>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="input-wrapper">
                <AtSign className="input-icon" />
                <input
                  type="email"
                  required
                  className="input-field"
                  placeholder="masukan email anda"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="nama depan"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
              </div>

              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="nama belakang"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </div>

              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field"
                  placeholder="buat password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
                <Lock className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className={`input-field ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="konfirmasi password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                {errors.password && (
                  <p className="error-message">{errors.password}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? 'Memproses...' : 'Registrasi'}
            </button>

            <div className="login-text">
              <span>sudah punya akun? login </span>
              <Link to="/login" className="login-link">
                di sini
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="illustration-section">
        <img
          src="/illustration-login.png"
          alt="Register Illustration"
          className="illustration-image"
        />
      </div>
    </div>
  );
};

export default Register;
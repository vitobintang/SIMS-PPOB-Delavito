import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { login } from '../store/slices/authSlice';
import { AtSign, Lock, Eye, EyeOff, X } from 'lucide-react'; // Changed Mail to AtSign
import Logo from '../components/Logo';
import './Login.css';

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login(formData)).unwrap();
      navigate('/', { state: { showSuccess: true } });
    } catch (error: any) {
      setError(error.message || 'Email atau password salah');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-section">
        <div className="login-form-wrapper">
          <div className="login-header">
            <div className="logo-title-wrapper">
              <Logo />
              <span className="app-title">SIMS PPOB</span>
            </div>
            <h2 className="login-title">
              Masuk atau buat akun <br />untuk memulai
            </h2>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-fields">
              <div className="input-group">
                <AtSign className="input-icon" />
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="masukan email anda"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="input-group">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="form-input"
                  placeholder="masukan password anda"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="submit-button"
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </div>

            <div className="register-prompt">
              <span className="register-text">belum punya akun? registrasi </span>
              <Link to="/register" className="register-link">
                di sini
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="illustration-section">
        <img
          src="/illustration-login.png"
          alt="Login Illustration"
          className="login-illustration"
        />
      </div>

      {error && (
        <div className="alert-container">
          <div className="alert-content">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="alert-close">
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
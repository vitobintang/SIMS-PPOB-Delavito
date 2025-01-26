import { Link, NavLink } from 'react-router-dom';
import Logo from '../components/Logo';
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="nav">
      <div className="container">
        <div className="wrapper">
          <Link to="/" className="logoLink">
            <div className="logoCircle">
              <Logo />
            </div>
            <span className="logoText">SIMS PPOB</span>
          </Link>
          <div className="menuContainer">
            <NavLink to="/topup" className={({ isActive }) => `menuLink ${isActive ? 'active' : ''}`}>
              Top Up
            </NavLink>
            <NavLink to="/transaction" className={({ isActive }) => `menuLink ${isActive ? 'active' : ''}`}>
              Transaction
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `menuLink ${isActive ? 'active' : ''}`}>
              Akun
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

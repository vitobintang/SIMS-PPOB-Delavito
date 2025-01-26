import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Eye, EyeOff } from 'lucide-react';
import './ProfileBalanceSection.css';

interface ProfileBalanceSectionProps {
  showBalance: boolean;
  onToggleBalance: () => void;
}

const ProfileBalanceSection: React.FC<ProfileBalanceSectionProps> = ({
  showBalance,
  onToggleBalance,
}) => {
  const { user } = useSelector((state: RootState) => state.profile);
  const { balance } = useSelector((state: RootState) => state.balance);

  return (
    <section className="profileSection">
      <div className="profileInfo">
        <img
          src={user?.profile_image || 'https://via.placeholder.com/150'}
          alt="Profile"
          className="userImage"
        />
        <div className="userInfo">
          <p className="welcomeText">Selamat datang,</p>
          <p className="userName">{`${user?.first_name} ${user?.last_name}`}</p>
        </div>
      </div>

      <div className="balanceCard">
        <div className="balanceWrapper">
          <span className="balanceLabel">Saldo anda</span>
          <span className="balanceAmount">
            {showBalance
              ? `Rp ${balance?.toLocaleString('id-ID')}`
              : 'Rp ••••••••'}
          </span>
          <button className="balanceToggle" onClick={onToggleBalance}>
            {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
            {showBalance ? 'Tutup Saldo' : 'Lihat Saldo'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProfileBalanceSection;

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { fetchProfile } from '../store/slices/profileSlice';
import { fetchBalance } from '../store/slices/balanceSlice';
import { processTopUp } from '../store/slices/topUpSlice';
import Navigation from './Navigation';
import ProfileBalanceSection from '../components/ProfileBalanceSection';
import './TopUp.css';
import { toast } from 'react-hot-toast';
import TopUpConfirmationModal from '../components/TopUpConfirmationModal';

const PRESET_AMOUNTS = [10000, 20000, 50000, 100000, 250000, 500000];

const TopUp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [showBalance, setShowBalance] = useState(false);
  const [amount, setAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [pendingAmount, setPendingAmount] = useState<number>(0);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchBalance());
  }, [dispatch]);

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount.toString());
  };

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) {
      toast.error('Please enter an amount');
      return;
    }

    const cleanAmount = amount.replace(/[^\d]/g, '');
    const numAmount = parseInt(cleanAmount);

    if (isNaN(numAmount) || numAmount < 10000) {
      toast.error('Minimum top up amount is Rp 10.000');
      return;
    }

    setPendingAmount(numAmount);
    setIsModalOpen(true);
  };

  const handleTopUpConfirm = async () => {
    try {
      await dispatch(processTopUp(pendingAmount)).unwrap();
      setIsSuccess(true);
    } catch (error) {
      setIsModalOpen(false);
    }
  };

  const formatAmount = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    return numbers ? parseInt(numbers).toString() : '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="homeContainer">
        <ProfileBalanceSection 
          showBalance={showBalance}
          onToggleBalance={() => setShowBalance(!showBalance)}
        />
        <div className="topupSection">
          <p className="topupSubtitle">Silahkan masukkan</p>
          <h2 className="topupTitle">Nominal Top Up</h2>

          <div className="topupContent">
            <div className="amountGrid">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset}
                  className="amountButton"
                  onClick={() => handleAmountSelect(preset)}
                >
                  Rp {preset.toLocaleString('id-ID')}
                </button>
              ))}
            </div>
            
            <div className="topupFormContainer">
              <form onSubmit={handleTopUp} className="topupForm">
                <input
                  type="text"
                  value={amount ? `Rp ${parseInt(amount).toLocaleString('id-ID')}` : ''}
                  onChange={(e) => {
                    const value = formatAmount(e.target.value);
                    setAmount(value);
                  }}
                  placeholder="Masukan nominal Top Up"
                  className="topupInput"
                />
                <button 
                  type="submit" 
                  className="topupButton"
                  disabled={!amount || parseInt(amount) < 10000}
                >
                  Top Up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <TopUpConfirmationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsSuccess(false);
          setPendingAmount(0);
          setAmount('');
        }}
        onConfirm={handleTopUpConfirm}
        amount={pendingAmount}
        isSuccess={isSuccess}
      />
    </div>
  );
};

export default TopUp;
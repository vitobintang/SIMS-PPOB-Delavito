import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from '../store';
import { fetchProfile } from '../store/slices/profileSlice';
import { fetchBalance } from '../store/slices/balanceSlice';
import { fetchServices } from '../store/slices/servicesSlice';
import { processPayment } from '../store/slices/transactionSlice';
import { Eye, EyeOff } from 'lucide-react';
import Navigation from './Navigation';
import './Payment.css';
import ConfirmationModal from '../components/ConfirmationModal';

const Payment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const serviceCode = searchParams.get('service');
  
  const { user } = useSelector((state: RootState) => state.profile);
  const { balance } = useSelector((state: RootState) => state.balance);
  const { services } = useSelector((state: RootState) => state.services);
  const { loading } = useSelector((state: RootState) => state.transactions);
  
  const [showBalance, setShowBalance] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchBalance());
    dispatch(fetchServices());
  }, [dispatch]);

  const service = services.find(s => s.service_code === serviceCode);

  const handlePaymentClick = () => {
    if (!service) return;
    if (balance < service.service_tariff) {
      toast.error('Saldo tidak mencukupi');
      return;
    }
    setIsModalOpen(true);
  };

  const handlePaymentConfirm = async () => {
    if (!service) return;
    try {
      await dispatch(processPayment(service.service_code));
      setIsSuccess(true); // Set success state instead of closing modal
    } catch (error) {
      toast.error('Payment failed');
      setIsModalOpen(false);
    }
  };

  if (!service) return <div>Service not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container">
        <div className="profileSection">
          <div className="profileInfo">
            <img
              src={user?.profile_image || 'https://via.placeholder.com/100'}
              alt="Profile"
              className="userImage"
            />
            <div className="userInfo">
              <h2 className="welcomeText">Selamat datang,</h2>
              <h1 className="userName">{`${user?.first_name} ${user?.last_name}`}</h1>
            </div>
          </div>

          <div className="balanceCard">
            <p className="balanceLabel">Saldo anda</p>
            <div className="balanceWrapper">
              <span className="balanceAmount">
                {showBalance
                  ? `Rp ${balance.toLocaleString('id-ID')}`
                  : 'Rp •••••••'}
              </span>
              <button onClick={() => setShowBalance(!showBalance)} className="balanceToggle">
                <span>Lihat Saldo</span>
                {showBalance ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
        </div>

        <div className="paymentSection">
          <p className="paymentSubtitle">Pembayaran</p>
          <div className="paymentInfo">
            <img
              src={service.service_icon}
              alt={service.service_name}
              className="serviceIcon"
            />
            <div className="serviceDetails">
              <h2 className="serviceName">{service.service_name}</h2>
              <p className="servicePrice">
                Rp {service.service_tariff.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
          <button
            onClick={handlePaymentClick}
            disabled={loading || balance < service.service_tariff}
            className="payButton"
          >
            {loading ? 'Processing...' : 'Bayar'}
          </button>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsSuccess(false);
        }}
        onConfirm={handlePaymentConfirm}
        service={service}
        isSuccess={isSuccess}
      />
    </div>
  );
};

export default Payment;
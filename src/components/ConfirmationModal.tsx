import { useNavigate } from 'react-router-dom';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  service: {
    service_name: string;
    service_icon: string;
    service_tariff: number;
  };
  isSuccess: boolean;
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm, service, isSuccess }: ConfirmationModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleBackToHome = () => {
    onClose();
    navigate('/');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {!isSuccess ? (
          <>
            <img 
              src="/src/public/Logo.png"
              alt="SIMS PPOB"
              className="modal-icon"
            />
            <p className="modal-text">
              Beli {service.service_name} senilai
            </p>
            <p className="modal-amount">
              Rp {service.service_tariff.toLocaleString('id-ID')} ?
            </p>
            <div className="modal-buttons">
              <button className="modal-confirm" onClick={onConfirm}>
                Ya, lanjutkan bayar
              </button>
              <button className="modal-cancel" onClick={onClose}>
                Batalkan
              </button>
            </div>
          </>
        ) : (
          <>
            <img 
              src="/src/public/success.png"
              alt="Success"
              className="modal-icon"
            />
            <p className="modal-text">
              Pembayaran {service.service_name} sebesar
            </p>
            <p className="modal-amount success">
              Rp {service.service_tariff.toLocaleString('id-ID')}
            </p>
            <p className="modal-success-text">berhasil</p>
            <button className="modal-home" onClick={handleBackToHome}>
              Kembali ke Beranda
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmationModal;

import { useNavigate } from 'react-router-dom';

interface TopUpConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: number;
  isSuccess: boolean;
}

const TopUpConfirmationModal = ({ isOpen, onClose, onConfirm, amount, isSuccess }: TopUpConfirmationModalProps) => {
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
              Anda yakin untuk Top Up sebesar
            </p>
            <p className="modal-amount">
              Rp {amount.toLocaleString('id-ID')} ?
            </p>
            <div className="modal-buttons">
              <button className="modal-confirm" onClick={onConfirm}>
                Ya, lanjutkan Top Up
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
              Top Up sebesar
            </p>
            <p className="modal-amount success">
              Rp {amount.toLocaleString('id-ID')}
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

export default TopUpConfirmationModal;

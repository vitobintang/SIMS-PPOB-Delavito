import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchProfile } from '../store/slices/profileSlice';
import { fetchBalance } from '../store/slices/balanceSlice';
import { fetchTransactions, setFilters } from '../store/slices/transactionsSlice';
import Navigation from './Navigation';
import './Transactions.css';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import ProfileBalanceSection from '../components/ProfileBalanceSection';
import { FiFilter } from 'react-icons/fi';

const LIMIT = 5;
const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli','Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const Transactions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, loading, hasMore, filters } = useSelector((state: RootState) => state.transactions);
  const [showBalance, setShowBalance] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchBalance());
    dispatch(fetchTransactions({ offset: 0, limit: LIMIT }));
  }, [dispatch]);

  const handleShowMore = () => {
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
    dispatch(fetchTransactions({ offset: newOffset, limit: LIMIT }));
  };

  const handleFilterChange = (filterType: 'month' | 'type', value: any) => {
    dispatch(setFilters({ [filterType]: value }));
    setOffset(0);
    dispatch(fetchTransactions({ offset: 0, limit: LIMIT }));
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.created_on);
    const monthMatch = filters.month === null || transactionDate.getMonth() === filters.month;
    const typeMatch = filters.type === 'ALL' || 
      (filters.type === 'TOPUP' ? transaction.transaction_type === 'TOPUP' : transaction.transaction_type !== 'TOPUP');
    return monthMatch && typeMatch;
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMMM yyyy   HH:mm 'WIB'", { locale: id });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="homeContainer">
        <ProfileBalanceSection 
          showBalance={showBalance}
          onToggleBalance={() => setShowBalance(!showBalance)}
        />
        <div className="transactionsSection">
          <div className="transactionsHeader">
            <h2 className="transactionsTitle">Semua Transaksi</h2>
            <button 
              className="filterButton"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <FiFilter /> Filter
            </button>
          </div>
          
          {isFilterOpen && (
            <div className="filterPanel">
              <div className="filterGroup">
                <label>Bulan:</label>
                <select 
                  value={filters.month === null ? '' : filters.month}
                  onChange={(e) => handleFilterChange('month', e.target.value === '' ? null : Number(e.target.value))}
                >
                  <option value="">Semua</option>
                  {MONTHS.map((month, index) => (
                    <option key={month} value={index}>{month}</option>
                  ))}
                </select>
              </div>
              <div className="filterGroup">
                <label>Tipe:</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  <option value="ALL">Semua</option>
                  <option value="TOPUP">Top Up</option>
                  <option value="PAYMENT">Pembayaran</option>
                </select>
              </div>
            </div>
          )}

          <div className="transactionsList">
            {Array.isArray(filteredTransactions) && filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <div key={transaction.invoice_number} className="transactionItem">
                  <div className="transactionInfo">
                    <span className={`transactionAmount ${
                      transaction.transaction_type === 'TOPUP' ? 'positive' : 'negative'
                    }`}>
                      {transaction.transaction_type === 'TOPUP' ? '+ ' : '- '}
                      Rp {transaction.total_amount.toLocaleString('id-ID')}
                    </span>
                    <span className="transactionDate">
                      {formatDate(transaction.created_on)}
                    </span>
                  </div>
                  <span className="transactionType">{transaction.description}</span>
                </div>
              ))
            ) : (
              <div className="emptyState">Tidak ada transaksi</div>
            )}
          </div>
          {hasMore && !loading && (
            <button onClick={handleShowMore} className="showMoreButton">
              Show More
            </button>
          )}
          {loading && <div className="loadingText">Loading...</div>}
        </div>
      </div>
    </div>
  );
};

export default Transactions;

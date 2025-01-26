import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { fetchProfile } from '../store/slices/profileSlice';
import { fetchServices } from '../store/slices/servicesSlice';
import { fetchBanners } from '../store/slices/bannersSlice';
import { fetchBalance } from '../store/slices/balanceSlice';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Navigation from './Navigation';
import ProfileBalanceSection from '../components/ProfileBalanceSection';
import { X } from 'lucide-react';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { services } = useSelector((state: RootState) => state.services);
  const { banners } = useSelector((state: RootState) => state.banners);
  const [showBalance, setShowBalance] = useState(false);
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchServices());
    dispatch(fetchBanners());
    dispatch(fetchBalance());
  }, [dispatch]);

  useEffect(() => {
    if (location.state?.showSuccess) {
      setShowSuccess(true);
      // Auto-hide after 4 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="homeContainer">
        <ProfileBalanceSection 
          showBalance={showBalance}
          onToggleBalance={() => setShowBalance(!showBalance)}
        />
        <div className="servicesGrid">
          {services.map((service) => (
            <Link
              key={service.service_code}
              to={`/payment?service=${service.service_code}`}
              className="serviceItem"
            >
              <img
                src={service.service_icon}
                alt={service.service_name}
                className="serviceIcon"
              />
              <span className="serviceName">{service.service_name}</span>
            </Link>
          ))}
        </div>

        <div className="promoSection">
          <h3 className="promoTitle">Temukan promo menarik</h3>
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={0}
            slidesPerView={1.8}
            centeredSlides={false}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            breakpoints={{
              640: { slidesPerView: 3.2, spaceBetween: 4 },
              1024: { slidesPerView: 4.2, spaceBetween: 4 }
            }}
            className="pb-8"
          >
            {banners.map((banner, index) => (
              <SwiperSlide key={index}>
                <div className="promoCard">
                  <img
                    src={banner.banner_image}
                    alt={banner.banner_name}
                    className="promoImage"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      {showSuccess && (
        <div className="alert-container success">
          <div className="alert-content">
            <span>Login berhasil</span>
            <button onClick={() => setShowSuccess(false)} className="alert-close">
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
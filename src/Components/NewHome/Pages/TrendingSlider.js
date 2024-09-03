import React from 'react';
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import "./TrendingSlider.css";

const TrendingSlider = () => {
  return (
    <section id="trending">
      <div className="container">
        <h1 className="text-center section-heading">Types of Permits in Our Online Permit-to-Work Software</h1>
      </div>
      <div className="container">
        <Swiper
          modules={[Navigation, Pagination, EffectCoverflow]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView="auto"
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
          }}
          pagination={{ clickable: true }}
          navigation
          className="trending-slider"
        >


          <SwiperSlide className="trending-slide">
            <div className="trending-slide-img">
              <div className="image-overlay"></div>
              <img src={require('../images/Electrical.jpg')} alt="Nike Jordans" />
            </div>
            <div className="trending-slide-content">
              <h1 className="shoe-price">Electrical Work Permit</h1>
              <div className="trending-slide-content-bottom">
                {/* <h3 className="shoe-rating">
                  <span>4.5</span>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star-half"></ion-icon>
                </h3> */}
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="trending-slide">
            <div className="trending-slide-img">
              <div className="image-overlay"></div>
              <img src={require('../images/Electrical.jpg')} alt="Nike Jordans" />
            </div>
            <div className="trending-slide-content">
              <h1 className="shoe-price">Electrical Work Permit</h1>
              <div className="trending-slide-content-bottom">
                {/* <h3 className="shoe-rating">
                  <span>4.5</span>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star-half"></ion-icon>
                </h3> */}
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="trending-slide">
            <div className="trending-slide-img">
              <div className="image-overlay"></div>
              <img src={require('../images/Electrical.jpg')} alt="Nike Jordans" />
            </div>
            <div className="trending-slide-content">
              <h1 className="shoe-price">Electrical Work Permit</h1>
              <div className="trending-slide-content-bottom">
                {/* <h3 className="shoe-rating">
                  <span>4.5</span>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star-half"></ion-icon>
                </h3> */}
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="trending-slide">
            <div className="trending-slide-img">
              <div className="image-overlay"></div>
              <img src={require('../images/Electrical.jpg')} alt="Nike Jordans" />
            </div>
            <div className="trending-slide-content">
              <h1 className="shoe-price">Electrical Work Permit</h1>
              <div className="trending-slide-content-bottom">
                {/* <h3 className="shoe-rating">
                  <span>4.5</span>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star-half"></ion-icon>
                </h3> */}
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="trending-slide">
            <div className="trending-slide-img">
              <div className="image-overlay"></div>
              <img src={require('../images/Electrical.jpg')} alt="Nike Jordans" />
            </div>
            <div className="trending-slide-content">
              <h1 className="shoe-price">Electrical Work Permit</h1>
              <div className="trending-slide-content-bottom">
                {/* <h3 className="shoe-rating">
                  <span>4.5</span>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star-half"></ion-icon>
                </h3> */}
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="trending-slide">
            <div className="trending-slide-img">
              <div className="image-overlay"></div>
              <img src={require('../images/Electrical.jpg')} alt="Nike Jordans" />
            </div>
            <div className="trending-slide-content">
              <h1 className="shoe-price">Electrical Work Permit</h1>
              <div className="trending-slide-content-bottom">
                {/* <h3 className="shoe-rating">
                  <span>4.5</span>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star-half"></ion-icon>
                </h3> */}
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="trending-slide">
            <div className="trending-slide-img">
              <div className="image-overlay"></div>
              <img src={require('../images/Electrical.jpg')} alt="Nike Jordans" />
            </div>
            <div className="trending-slide-content">
              <h1 className="shoe-price">Electrical Work Permit</h1>
              <div className="trending-slide-content-bottom">
                {/* <h3 className="shoe-rating">
                  <span>4.5</span>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star-half"></ion-icon>
                </h3> */}
              </div>
            </div>
          </SwiperSlide>

          
        </Swiper>
        <div className="trending-slider-control">
          <div className="swiper-button-prev slider-arrow">
            <ion-icon name="arrow-back-outline"></ion-icon>
          </div>
          <div className="swiper-button-next slider-arrow">
            <ion-icon name="arrow-forward-outline"></ion-icon>
          </div>
          <div className="swiper-pagination"></div>
        </div>
      </div>
    </section>
  );
};

export default TrendingSlider;

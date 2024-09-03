import React from 'react';
import "./Footer.css";
import logo from "./img/logo-removebg-preview.png";
import instagram from "./img/1161953_instagram_icon.png";
import twitter from "./img/5305170_bird_social media_social network_tweet_twitter_icon.png";
import fb from "./img/5305153_fb_facebook_facebook logo_icon.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={logo} alt="Company Logo" />
        </div>
        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p style={{ fontSize: '0.7rem'}}>Unit No 221, Sunsquare Plaza Complex, 2nd & 4th Floor, 450-451-452, SPL1/J, RIICO Chowk, Bhiwadi, Rajasthan 301019</p>
          <p style={{ fontSize: '0.7rem'}}>Email: info@thesafetymaster.com</p>
          <p style={{ fontSize: '0.7rem'}}>Phone: 076652 31743</p>
        </div>
        <div className="footer-more">
          <h3>More</h3>
          <ul>
            <li><a href="https://www.thesafetymaster.com/about-us/">About Us</a></li>
            <li><a href="https://www.thesafetymaster.com/">Products</a></li>
            <li><a href="https://www.thesafetymaster.com/contact-us/">Career</a></li>
            <li><a href="https://www.thesafetymaster.com/contact-us/">Contact Us</a></li>
          </ul>
        </div>
        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://www.instagram.com/accounts/login/?next=https%3A%2F%2Fwww.instagram.com%2Fthesafetymaster_tsm%2F&is_from_rle"><img className="social-logo-insta" src={instagram} alt='socil-logo' /></a>
            <a href="https://x.com/thsafetymaster"><img className="social-logo-twitter" src={twitter} alt='socil-logo' /></a>
            <a href="https://www.facebook.com/thesafetymaster"><img className="social-logo-fb" src={fb} alt='socil-logo' /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; 2024 TSM TheSafetyMaster Private Limited </div>
    </footer>
  );
};

export default Footer;
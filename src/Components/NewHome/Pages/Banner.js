import React, { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";

import img1 from "../images/young-man-engineer-working-factory.jpg";
import { Link } from "react-router-dom";

const Banner = () => {
  const [bannerData] = useState({
    title: "Online Permit to Work Software",
    text: "Online Permit to Work software streamlines task approvals, enhances safety, and ensures compliance. Manage permits effortlessly and securely, all in one platform.",
    image: img1,
  });

  return (
    <header className="Home-header">
      <div className="Banner_container">
        <div className="row">
          <div className="col-6">
            <div className="header__content">
              <div className="header__section">
                <ul className="header__ul">
                  <li>
                    <Link to="https://www.facebook.com/thesafetymaster" className="home-no-decoration" target="_blank" rel="noopener noreferrer">
                    <FaFacebookF className="headerIconFb" />
                    </Link>
                  </li>
                  <li>
                    <Link to="https://x.com/thsafetymaster?mx=2" className="home-no-decoration" target="_blank" rel="noopener noreferrer">
                    <FaTwitter className="headerIconX" />
                    </Link>
                  </li>
                  <li>
                    <Link to='https://www.linkedin.com/company/thesafetymaster/' className="home-no-decoration" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="headerIconLinkedin" />
                    </Link>
                  </li>
                  <li>
                  <Link to='https://www.instagram.com/thesafetymaster_tsm/' className="home-no-decoration" target="_blank" rel="noopener noreferrer">
                    <FaInstagram className="headerIconInsta" />
                  </Link>
                  </li>
                  <li>
                  <Link to='https://www.youtube.com/channel/UCfBqBnuUfcMlORvhBaft7yA' className="home-no-decoration" target="_blank" rel="noopener noreferrer">
                    <FaYoutube className="headerIconYt" />
                  </Link>
                  </li>
                </ul>
                <h1>{bannerData.title}</h1>
                <p>{bannerData.text}</p>
                <Link style={{ textDecoration: 'none' }} to='/login'>
                <button className="cssbuttons-io-button">
                  Get started
                  <div className="icon">
                    <svg
                      height="24"
                      width="24"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 0h24v24H0z" fill="none"></path>
                      <path
                        d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="banner__img">
              <img src={bannerData.image} alt="man" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Banner;

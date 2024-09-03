// Components/Navbar/Pages/UserNavbar.js
import React, { useEffect, useState } from "react";
import { FaAlignJustify, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../../Firebase";
import "./UserNavbar.css";
import logo from "../../../Images/TSM-Logo.png";

const UserNavbar = ({ hideLogoutButton }) => {
  const [nav, setNav] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const changeBackground = () => {
    if (window.scrollY >= 50) {
      setNav(true);
    } else {
      setNav(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', changeBackground);
    return () => {
      window.removeEventListener('scroll', changeBackground);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className={nav ? 'navbarScroll active' : 'navbar'}>
      <div className="container">
        <div className="navbar__container">
          <div className="navbar__left">
            <div className={nav ? "navbar__left-logo_scroll" : "navbar__left-logo"}>
              <img src={logo} alt="logo" />
            </div>
          </div>
          <div className="navbar__toggle" onClick={toggleMenu}>
            {menuOpen ? <FaTimes /> : <FaAlignJustify />}
          </div>
          <ul className={`navbar__right ${menuOpen ? 'active' : ''}`}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">PTW</Link>
            </li>
            <li>
              <Link to="https://www.thesafetymaster.com/contact-us/">Contact Us</Link>
            </li>
            <li>
              <Link to="https://www.thesafetymaster.com/">TSM</Link>
            </li>
            {isLoggedIn && !hideLogoutButton && (
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            )}
            {!isLoggedIn && !hideLogoutButton && (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;

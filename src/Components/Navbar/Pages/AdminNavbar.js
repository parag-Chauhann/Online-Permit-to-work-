// Components/Navbar/Pages/AdminNavbar.js
import React, { useEffect, useState } from "react";
import { FaAlignJustify, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../../Firebase";
import "./AdminNavbar.css";
import logo from "../../../Images/TSM-Logo.png";

const AdminNavbar = ({ hideLogoutButton }) => {
  const navigate = useNavigate();
  const [nav, setNav] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={nav ? 'navbarScroll active' : 'adminNavbar'}>
      <div className="container">
        <div className="adminNavbar__container">
          <div className="adminNavbar__left">
            <div className={nav ? "adminNavbar__left-logo_scroll" : "adminNavbar__left-logo"}>
              <img src={logo} alt="logo" />
            </div>
          </div>
          <div className="adminNavbar__toggle" onClick={toggleMenu}>
            {menuOpen ? <FaTimes /> : <FaAlignJustify />}
          </div>
          <ul className={`adminNavbar__right ${menuOpen ? 'active' : ''}`}>
            <li>
              <Link to="/adminDashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/adminUserManagement">Users</Link>
            </li>
            <li>
              <Link to="/adminApproverManagement">Areas & Approvers</Link>
            </li>
            <li>
              <Link to="/adminSafetyDepartmentManagement">Safety Approvers</Link>
            </li>
            <li>
              <Link to="/packageDetails">Packages</Link>
            </li>
            <li>
              <Link to="/generateUniquePermitNumber">PTW No.</Link>
            </li>
            {!hideLogoutButton && (
              <li onClick={handleLogout}>
                {/* <button className="unique-btn">
                  <div className="icon-wrapper">
                    <svg viewBox="0 0 512 512">
                      <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                    </svg>
                  </div>
                  <div className="button-text">Logout</div>
                </button> */}
                Logout
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;

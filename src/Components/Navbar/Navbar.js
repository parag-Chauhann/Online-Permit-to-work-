// Components/NewHome/Pages/Navbar.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../useAuth';
import AdminNavbar from '../Navbar/Pages/AdminNavbar';
import UserNavbar from '../Navbar/Pages/UserNavbar';
import "./Pages/AdminNavbar";

const Navbar = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

  // Check if the current path is one of the pages where logout should not be shown
  const hideLogoutButton = ['/', '/login', '/signup'].includes(location.pathname);

  return (
    <div className='Main-Navbar'>
      {currentUser && currentUser.isAdmin ? (
        <AdminNavbar hideLogoutButton={hideLogoutButton} />
      ) : (
        <UserNavbar hideLogoutButton={hideLogoutButton} />
      )}
    </div>
  );
};

export default Navbar;

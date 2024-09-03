import React, { useEffect, useState } from "react";
import { FaAlignJustify } from "react-icons/fa";
import "../Home.css";
import { Link } from "react-router-dom";
import logo from "../../../Images/TSM-Logo.png";


const Nav = () => {
    const [state, setState] = useState(true);
    const [nav, setNav] = useState(false);
    
    const changeBackground = () => {
        if (window.scrollY >= 50) {
            setNav(true);
        } else {
            setNav(false);
        }
    };
    
    useEffect(() => {
        window.addEventListener('scroll', changeBackground);

        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener('scroll', changeBackground);
        };
    }, []);

    
    return (
        <nav className={nav ? 'navbarScroll active' : 'navbar'}>
            <div className="container">
                <div className="navbar__container">
                    <ul className="navbar__left">
                        <div className={nav ? "navbar__left-logo_scroll" : "navbar__left-logo"}>
                            <img src={logo} alt="logo" />
                        </div>
                    </ul>
                    {state ? (
                        <ul className={nav ? "navbar__right_scroll" :"navbar__right"}>
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
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                        </ul>
                    ) : (
                        ""
                    )}
                </div>
            </div>
            <div className="toggle" onClick={() => setState(!state)}>
                <FaAlignJustify />
            </div>
    </nav>
  );
};

export default Nav;

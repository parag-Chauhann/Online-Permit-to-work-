import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from "../../../Firebase";
import { setDoc, doc } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';
import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { FaUser } from "react-icons/fa";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [registerForm, setRegisterForm] = useState({
    companyName: "",
    fname: "",
    lname: "",
    email: "",
    password: "",
    rememberMe: false
  });

  const [error, setError] = useState('');

  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterForm((prevForm) => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const isOfficialEmail = (email) => {
    // A regex pattern to match common official email formats
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const isPasswordStrong = (password) => {
    // Password should be at least 8 characters long and include letters and numbers
    const strongPasswordPattern = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    return strongPasswordPattern.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!isOfficialEmail(registerForm.email)) {
      setError('Please provide a valid official email address.');
      return;
    }

    if (!isPasswordStrong(registerForm.password)) {
      setError('Your password must be at least 8 characters long and include both letters and numbers.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerForm.email, registerForm.password);
      const user = userCredential.user;

      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: registerForm.fname,
          lastName: registerForm.lname,
          company: registerForm.companyName,
          password: registerForm.password,
          isAdmin: false,
          paymentStatus: false,
          selectedPlan: null,
          purchaseDate: null,
          permitsCreated: 0,
        });

        navigate("/subscription", {
          state: {
            firstname: registerForm.fname,
            email: registerForm.email,
            userId: user.uid,
          }
        });
      }
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('This email is already in use. Please try a different email.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address. Please check and try again.');
          break;
        case 'auth/operation-not-allowed':
          setError('Sign up is currently disabled. Please contact support.');
          break;
        case 'auth/weak-password':
          setError('Your password is too weak. Please choose a stronger password.');
          break;
        default:
          setError('An error occurred during sign up. Please try again.');
      }
      console.error(error.message);
    }
  };

  return (
    <div className='signup-form'>
      <h3 className='signup-heading'>Signup</h3>
      <form className="form" onSubmit={handleRegister}>
        <div className="flex-column">
          <label>Company Name </label>
        </div>
        <div className="inputForm">
          <HiMiniBuildingOffice2 />
          <input
            className="input"
            name='companyName'
            placeholder="Enter your Company Name"
            required
            value={registerForm.companyName}
            onChange={handleRegisterChange}
          />
        </div>

        <div className="flex-column">
          <label>First Name </label>
        </div>
        <div className="inputForm">
          <FaUser />
          <input
            className="input"
            name='fname'
            placeholder="Enter your First Name"
            required
            value={registerForm.fname}
            onChange={handleRegisterChange}
          />
        </div>

        <div className="flex-column">
          <label>Last Name </label>
        </div>
        <div className="inputForm">
          <FaUser />
          <input
            className="input"
            name='lname'
            placeholder="Enter your Last Name"
            required
            value={registerForm.lname}
            onChange={handleRegisterChange}
          />
        </div>

        <div className="flex-column">
          <label>Email </label>
        </div>
        <div className="inputForm">
          <svg height="20" viewBox="0 0 32 32" width="20" xmlns="http://www.w3.org/2000/svg">
            <g id="Layer_3" data-name="Layer 3">
              <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
            </g>
          </svg>
          <input
            className="input"
            name='email'
            placeholder="Enter your Email"
            type="email"
            required
            value={registerForm.email}
            onChange={handleRegisterChange}
          />
        </div>

        <div className="flex-column">
          <label>Password </label>
        </div>
        <div className="inputForm">
          <svg height="20" viewBox="-64 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg">
            <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
            <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
          </svg>
          <input 
            className="input"
            name="password"
            placeholder="Enter your Password"
            type="password"
            required
            value={registerForm.password}
            onChange={handleRegisterChange}
          />
        </div>

        <div className="password-requirements">
          <p>Password must meet the following criteria:</p>
          <ul>
            <li>At least 8 characters long</li>
            <li>Includes both letters and numbers</li>
          </ul>
        </div>

        <div className="flex-row">
          <div>
            <input 
              type="checkbox" 
              name="rememberMe"
              checked={registerForm.rememberMe}
              onChange={handleRegisterChange}
            />
            <label>Remember me </label>
          </div>
        </div>
        <div className='centre-btn'>
          <button className='signup-button' type="submit">
            Signup
            <div className="arrow-wrapper">
              <div className="arrow"></div>
            </div>
          </button>
        </div>
        {error && <div className="error">{error}</div>}
      </form>
      <div className='login-link'>
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

export default Signup;

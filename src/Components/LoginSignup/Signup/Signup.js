import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from "../../../Firebase";
import { setDoc, doc } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';
import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { FaUser } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Icons for password visibility toggle
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // Icons for tick/cross feedback
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [registerForm, setRegisterForm] = useState({
    companyName: "",
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false
  });

  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(null); // Track password match status
  const [passwordConditions, setPasswordConditions] = useState({
    length: false,
    lettersAndNumbers: false,
    specialCharacter: false,
  });

  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterForm((prevForm) => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Check if passwords match
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordMatch(registerForm.password === value);
    }

    // Update password conditions
    if (name === 'password') {
      updatePasswordConditions(value);
    }
  };

  const updatePasswordConditions = (password) => {
    setPasswordConditions({
      length: password.length >= 8,
      lettersAndNumbers: /^(?=.*[a-zA-Z])(?=.*\d)/.test(password),
      specialCharacter: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const isPasswordStrong = () => {
    return Object.values(passwordConditions).every(Boolean);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!isPasswordStrong()) {
      setError('Please meet all the password requirements.');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerForm.email, registerForm.password);
      const user = userCredential.user;

      if (user) {
        await sendEmailVerification(user); // Send email verification

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
      
        alert('A verification email has been sent to your email address. Please verify before logging in.');
        
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
          <input
            className="input"
            name='password'
            placeholder="Enter your Password"
            type={passwordVisible ? "text" : "password"}
            required
            value={registerForm.password}
            onChange={handleRegisterChange}
          />
          <span className="eye-icon" onClick={togglePasswordVisibility}>
            {passwordVisible ? <AiFillEye /> : <AiFillEyeInvisible />}
          </span>
        </div>

        {/* Password Requirements */}
        <div className="password-requirements">
          <p>Password must meet the following criteria:</p>
          <ul>
            <li>
              At least 8 characters long{' '}
              {passwordConditions.length ? <FaCheckCircle color="green" /> : <FaTimesCircle color="red" />}
            </li>
            <li>
              Includes both letters and numbers{' '}
              {passwordConditions.lettersAndNumbers ? <FaCheckCircle color="green" /> : <FaTimesCircle color="red" />}
            </li>
            <li>
              Contains at least one special character{' '}
              {passwordConditions.specialCharacter ? <FaCheckCircle color="green" /> : <FaTimesCircle color="red" />}
            </li>
          </ul>
        </div>

        <div className="flex-column">
          <label>Confirm Password </label>
        </div>
        <div className="inputForm">
          <input
            className="input"
            name='confirmPassword'
            placeholder="Confirm your Password"
            type={confirmPasswordVisible ? "text" : "password"}
            required
            value={registerForm.confirmPassword}
            onChange={handleRegisterChange}
          />
          {/* <span className="eye-icon" onClick={toggleConfirmPasswordVisibility}>
            {confirmPasswordVisible ? <AiFillEye /> : <AiFillEyeInvisible />}
          </span> */}
        </div>

        {registerForm.password && registerForm.confirmPassword && (
          <div className="emoji-feedback">
            {passwordMatch ? "😊 Passwords match!" : "😟 Passwords do not match!"}
          </div>
        )}

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

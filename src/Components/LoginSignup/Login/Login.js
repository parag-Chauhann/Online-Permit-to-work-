import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../../Firebase';
import './Login.css';
import { doc, getDoc } from 'firebase/firestore';

function Login() {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginForm;
    setLoading(true);
    const auth = getAuth();
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (user) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'Users', user.uid));
        const userData = userDoc.data();
  
        if (userData) {
          console.log("Fetched user data:", userData);
  
          // Extract permit number from URL query parameters
          const urlParams = new URLSearchParams(window.location.search);
          const permitNumber = urlParams.get('permitNumber');
  
          console.log("Extracted permit number:", permitNumber);
  
          // Navigate based on user role and permit number
          if (userData.isAdmin) {
            if (userData.paymentStatus) {
              navigate('/adminDashboard');
            } else {
              navigate('/subscription');
            }
          } else if (userData.isApprover) {
            if (permitNumber) {
              navigate(`/approve/${encodeURIComponent(permitNumber)}`);
            } else {
              navigate('/no-access');
            }
          } else if (userData.isSafetyDepartment) {
            if (permitNumber) {
              navigate(`/safety-approval/${encodeURIComponent(permitNumber)}`);
            } else {
              navigate('/no-access');
            }
          } else {
            if (userData.paymentStatus) {
              navigate('/permitdashboard');
            } else {
              navigate('/subscription');
            }
          }
        } else {
          setError('User document does not exist');
          navigate('/no-access');
        }
      } else {
        setError('Login failed');
        navigate('/no-access');
      }
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (error.code === 'auth/user-not-found') {
        setError('User not found');
      } else if (error.code === 'auth/user-disabled') {
        setError('User account disabled');
      } else if (error.code === 'auth/invalid-credential') {
        setError('Invalid credentials. Please check your email and password');
      } else {
        setError('Login failed. Please try again later');
      }
      console.error('Error logging in:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className='login-form'>
      <h3 className='login-heading'>Login</h3>
      <form className="form" onSubmit={handleLogin}>
        {/* Email input */}
        <div className="flex-column">
          <label htmlFor='email'>Email</label>
          <div className="inputForm">
          <svg height="20" viewBox="0 0 32 32" width="20" xmlns="http://www.w3.org/2000/svg">
            <g id="Layer_3" data-name="Layer 3">
              <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
            </g>
          </svg>
            <input
              id="email"
              className="input"
              name='email'
              placeholder="Enter your Email"
              type="email"
              required
              value={loginForm.email}
              onChange={handleLoginChange}
            />
          </div>
        </div>

        {/* Password input */}
        <div className="flex-column">
          <label htmlFor='password'>Password</label>
          <div className="inputForm">
          <svg height="20" viewBox="-64 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg">
            <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
            <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
          </svg>
            <input
              id="password"
              className="input"
              name="password"
              placeholder="Enter your Password"
              type="password"
              required
              value={loginForm.password}
              onChange={handleLoginChange}
            />
          </div>
        </div>
        
        {/* Remember me and forgot password */}
        <div className="flex-row">
          <div>
            <input type="checkbox" id="rememberMe" />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          <Link to="/forgotPassword">
            <span className="span">Forgot password?</span>
          </Link>
        </div>

        {/* Submit button */}
        <div className='centre-btn'>
          <button className='login-button' type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>

      {/* Error message */}
      {error && <p className="error">{error}</p>}

      {/* Sign-up link */}
      <p className="p">Don't have an account?</p>
      <Link to='/signup'>
        <button className="signup-button type1">Sign Up</button>
      </Link>
    </div>
  );
}

export default Login;

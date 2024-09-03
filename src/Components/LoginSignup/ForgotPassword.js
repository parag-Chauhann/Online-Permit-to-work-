import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./ForgotPassword.css";
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from "../../Firebase";

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        console.log('Email submitted:', email);
        try {
            // Attempt to send a password reset email
            await sendPasswordResetEmail(auth, email);
            setMessage("If an account with this email exists, you will receive a password reset email.");
            setError('');
            setTimeout(() => {
                navigate('/login');
            }, 5000); 
        } catch (err) {
            // Handle specific error codes
            console.error('Error details:', err); // Log error for debugging
            let errorMessage = 'An unexpected error occurred. Please try again later.';
            if (err.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (err.code === 'auth/user-not-found') {
                errorMessage = 'No user found with this email address.';
            } else if (err.code === 'auth/missing-android-pkg-name') {
                errorMessage = 'Android package name is missing.';
            } else if (err.code === 'auth/missing-ios-bundle-id') {
                errorMessage = 'iOS bundle ID is missing.';
            } else {
                errorMessage = err.message;
            }
            setError(errorMessage);
            setMessage('');
        }
    };

    return (
        <div className="forgotpasswrd-container">
            <div className="form-container">
                <div className="logo-container">Forgot Password</div>
                <form className="form" onSubmit={handleReset}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {message && <div className="form-message success">{message}</div>}
                    {error && <div className="form-message error">{error}</div>}
                    <button className="form-submit-btn" type="submit">Reset</button>
                </form>
                <p className="signup-link">
                    Don't have an account?
                    <Link to="/signup" className="signup-link link">Sign up now</Link>
                </p>
            </div>
        </div>
    );
}

export default ForgotPassword;

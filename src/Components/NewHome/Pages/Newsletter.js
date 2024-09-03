import React, { useState } from 'react';
import './Newsletter.css';
import { db,  } from '../../../Firebase';
import { collection, addDoc } from "firebase/firestore";

function Newsletter() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setMessage('Please enter a valid email address.');
            return;
        }

        try {
            // Use Firestore's modular functions
            const subscriberRef = collection(db, 'subscribers');
            await addDoc(subscriberRef, { email });
            setMessage('Subscription successful! Check your inbox for updates.');
            setEmail('');
        } catch (error) {
            console.error('Error subscribing:', error);
            setMessage('An error occurred. Please try again later.');
        }
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    return (
        <div className='newsletter'>
            <div className="newsletter-card">
                <span className="card__title">Newsletter</span>
                <p className="card__content">
                    Sign up for our newsletter and you'll be the first to find out about new features
                </p>
                <form className="card__form" onSubmit={handleSubmit}>
                    <input required="" type="email" placeholder="Enter your Email" />
                    <button className="card__bubtton">Click me</button>
                </form>
            </div>
        </div>
    );
}

export default Newsletter;

import React, { useEffect } from 'react';
import './Success.css';

const Success = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    const planParam = params.get('plan');
    const purchaseDateParam = params.get('purchaseDate');

    console.log('Email Parameter:', emailParam);
    console.log('Plan Parameter:', planParam);
    console.log('Purchase Date Parameter:', purchaseDateParam);
  }, []); // The empty dependency array ensures this effect runs only once

  return (
    <div className="success-container">
      <div className="success-message">
        <h1>Payment Successful!</h1>
        <p>Thank you for your purchase!</p>
        <p>Your subscription has been activated.</p>
        <p>We are excited to have you on board! You can now access all premium features and services of our Online Work Permit System.</p>
        <div className="success-actions">
          <button onClick={() => window.location.href = '/adminDashboard'} className="btn-dashboard">
            Go to Dashboard
          </button>
          <button onClick={() => window.location.href = '/'} className="btn-home">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;

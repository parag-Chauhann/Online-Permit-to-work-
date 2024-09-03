import React from 'react';
import "./Cancel.css";

const Cancel = () => {
  return (
    <div className='cancel-container'>
      <div className="card">
        <div className="header">
          <div className="image">
            <svg aria-hidden="true" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke-linejoin="round" stroke-linecap="round"></path>
            </svg>
          </div>
          <div className="content">
            <span className="title">Payment Cancelled account</span>
            <p className="message">Your payment was not completed. Please try again.</p>
          </div>
          <div className="actions">
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cancel;

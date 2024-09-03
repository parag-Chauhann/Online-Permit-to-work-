import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { key } from './config'; // Ensure this is correctly set up
import './PayUPaymentPage.css';
import axios from 'axios';

const PayUPaymentPage = ({ setToggle, form = {}, hash, transactionId, selectedPlan }) => {
  const navigate = useNavigate();
  const formRef = React.useRef();

  useEffect(() => {
    if (hash) {
      // Additional logic if needed when hash is present
    }
  }, [hash]);

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        await axios.post('http://localhost:5000/subscription/api/payu/success', {
          transactionId: transactionId,
          email: form.email,
          selectedPlan: selectedPlan,
        });

        navigate(
          `/success?email=${encodeURIComponent(form.email)}&plan=${encodeURIComponent(
            selectedPlan
          )}&purchaseDate=${encodeURIComponent(new Date().toISOString())}`
        );
      } catch (error) {
        console.error('Error notifying success:', error);
        navigate('/failure');
      }
    };

    const paymentIsSuccessful = false; // Change this according to actual payment status
    if (paymentIsSuccessful) {
      handlePaymentSuccess();
    }
  }, [form.email, transactionId, selectedPlan, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hash) {
      alert('Hash is missing. Cannot proceed to payment.');
      return;
    }
    formRef.current.submit(); // Trigger the form submission
  };

  return (
    <div className="payment-container">
      <h2>Payment Details</h2>
      <form>
        <input type="text" name="productinfo" value={selectedPlan} readOnly />
        <input type="text" name="firstname" value={form?.fname || ''} readOnly />
        <input type="email" name="email" value={form?.email || ''} readOnly />
        <input type="tel" name="phone" value={form?.number || ''} readOnly />
      </form>
      <form
        ref={formRef}
        action="https://test.payu.in/_payment"
        method="POST"
        onSubmit={() => {
          if (!hash) {
            alert('Hash is missing. Cannot proceed to payment.');
            return false;
          }
          return true; // Proceed to PayU
        }}
      >
        <input type="hidden" name="key" value={key} />
        <input type="hidden" name="txnid" value={transactionId} />
        <input type="hidden" name="amount" value={form.amount || ''} />
        <input type="hidden" name="productinfo" value={selectedPlan} />
        <input type="hidden" name="firstname" value={form?.fname || ''} />
        <input type="hidden" name="email" value={form?.email || ''} />
        <input type="hidden" name="phone" value={form?.number || ''} />
        <input type="hidden" name="surl" value="http://localhost:5000/subscription/api/payu/success" />
        <input type="hidden" name="furl" value="http://localhost:5000/subscription/api/payu/failure" />
        <input type="hidden" name="hash" value={hash} />

        <div className="PAY-NOW-container" type="submit" onClick={handleSubmit}>
          <div className="PAY-NOW-left-side">
            <div className="PAY-NOW-card">
              <div className="PAY-NOW-card-line"></div>
              <div className="PAY-NOW-buttons"></div>
            </div>
            <div className="PAY-NOW-post">
              <div className="PAY-NOW-post-line"></div>
              <div className="PAY-NOW-screen">
                <div className="PAY-NOW-dollar">₹</div>
              </div>
              <div className="PAY-NOW-numbers"></div>
              <div className="PAY-NOW-numbers-line2"></div>
            </div>
          </div>
          <div className="PAY-NOW-right-side">
            <div className="PAY-NOW-new">Pay Now</div>
            <svg
              viewBox="0 0 451.846 451.847"
              height="512"
              width="512"
              xmlns="http://www.w3.org/2000/svg"
              className="PAY-NOW-arrow"
            >
              <path
                fill="#cfcfcf"
                d="M345.441 248.292L151.154 442.573c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744L278.318 225.92 106.409 54.017c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.287 194.284c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373z"
              ></path>
            </svg>
          </div>
        </div>

        <button type="button" onClick={() => setToggle(1)}>
          Back
        </button>
      </form>
    </div>
  );
};

export default PayUPaymentPage;

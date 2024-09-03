import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PayUPaymentPage from './PayUPaymentPage';
import "./CheckoutPage.css";
import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate(); // For navigation
  const [form, setForm] = useState({
    fname: '',
    lname: '',
    email: '',
    amount: 0,
    number: ''
  });

  const [toggle, setToggle] = useState(1);
  const [hash, setHash] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPlanDetails, setCurrentPlanDetails] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        setForm(prevForm => ({
          ...prevForm,
          fname: currentUser.firstName,
          lname: currentUser.lastName,
          email: currentUser.email
        }));
      }
    };

    fetchUserData();
    generateTransactionID();
  }, [currentUser]);

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    const selectedPlanDetails = plans.find(plan => plan.id === planId);
    setForm(prevForm => ({
      ...prevForm,
      amount: selectedPlanDetails.price,
      planId: planId,
      productinfo: selectedPlanDetails.heading 
    }));
    
    // No automatic navigation or account creation here
  };
  
 
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = {
      fname: form.fname,
      lname: form.lname,
      email: form.email,
      planId: selectedPlan,
    };
  
    // If Free Plan is selected, skip payment gateway and create account
    if (selectedPlan === 'free') {
      axios.post('https://backend-online-work-permit-system-1.onrender.com/success/api/user/create', formData)
        .then(response => {
          navigate('/success'); // Redirect to success page
        })
        .catch(error => {
          console.error('Error creating account:', error);
        });
    } else {
      // For paid plans, generate hash and toggle to payment page
      getHash();
      setToggle(2); // Toggle to payment page
    }
  };
  

  const handleChange = (e) => {
    if (e.target.name === 'amount') {
      setForm({ ...form, [e.target.name]: parseFloat(e.target.value) });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleInfoClick = (planId) => {
    setCurrentPlanDetails(planDetails[planId]);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setCurrentPlanDetails(null);
  };

  const generateTransactionID = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000000);
    const transactionID = `T${timestamp}${randomNum}`;
    setTransactionId(transactionID);
  };

  const getHash = () => {
    axios.post('https://backend-online-work-permit-system-1.onrender.com/subscription/api/payu/hash', {
      ...form,
      transactionId: transactionId,
      productinfo: selectedPlan
    })
      .then(res => {
        setHash(res.data.hash);
        setTransactionId(res.data.transactionId);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const plans = [
    {
      id: 'free',
      heading: "Free Plan",
      price: 0,
      description: "Basic access with limited features.",
    },
    {
      id: 'Premium',
      heading: "Premium Plan",
      price: 2000,
      description: "Unlimited access with advanced features.",
    },
    {
      id: 'Enterprise',
      heading: "Enterprise Plan",
      price: 20000,
      description: "Full-featured access with premium support.",
    }
  ];

  const planDetails = {
    free: {
      heading: "Free Plan",
      features: {
        permitGeneration: "30 Permits",
        automatedMailNotification: "Yes",
        analyticalDashboard: "Yes",
        reminderAndOverdueMailNotification: "No",
        assignRoles: "Yes",
        permitStatusTracking: "Yes",
        downloadPermitsInMultipleFormats: "No",
        sequentialPermitNumbering: "No",
        mailServiceSupport: "No",
        prioritySupport: "No",
        onSiteTraining: "No",
      }
    },
    Premium: {
      heading: "Premium Plan",
      features: {
        permitGeneration: "Unlimited",
        automatedMailNotification: "Yes",
        analyticalDashboard: "Yes",
        reminderAndOverdueMailNotification: "Yes",
        assignRoles: "Yes",
        permitStatusTracking: "Yes",
        downloadPermitsInMultipleFormats: "Yes",
        sequentialPermitNumbering: "Yes",
        mailServiceSupport: "Yes",
        prioritySupport: "Standard",
        onSiteTraining: "No",
      }
    },
    Enterprise: {
      heading: "Enterprise Plan",
      features: {
        permitGeneration: "Unlimited",
        automatedMailNotification: "Yes",
        analyticalDashboard: "Yes",
        reminderAndOverdueMailNotification: "Yes",
        assignRoles: "Yes",
        permitStatusTracking: "Yes",
        downloadPermitsInMultipleFormats: "Yes",
        sequentialPermitNumbering: "Yes",
        mailServiceSupport: "Yes",
        prioritySupport: "24/7 Priority",
        onSiteTraining: "Yes",
      }
    }
  };

  return (
    <>
      {toggle === 1 && (
        <div className='checkout-form-centre'>
          <div className="pricing-cards">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`plan ${selectedPlan === plan.id ? 'selected' : ''}`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                <div className="inner">
                  <div className="info-button" onClick={(e) => { e.stopPropagation(); handleInfoClick(plan.id); }}>
                    <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="2" fill="none" />
                      <line x1="12" y1="8" x2="12" y2="10" stroke="black" strokeWidth="2" />
                      <line x1="12" y1="12" x2="12" y2="16" stroke="black" strokeWidth="2" />
                    </svg>
                  </div>
                  <span className="pricing">
                    <span>
                      Rs.{plan.price} <small>/ Month</small>
                    </span>
                  </span>
                  <p className="title">{plan.heading}</p>
                  <p className="info">{plan.description}</p>
                </div>
              </div>
            ))}
            {showPopup && currentPlanDetails && (
              <div className="popup-overlay" onClick={closePopup}>
                <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                  <h2>{currentPlanDetails.heading}</h2>
                  <table className="popup-table">
                    <tbody>
                      {Object.entries(currentPlanDetails.features).map(([feature, value]) => (
                        <tr key={feature}>
                          <th>{feature.replace(/([A-Z])/g, ' $1').toUpperCase()}</th>
                          <td>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button onClick={closePopup} className="close-button">Close</button>
                </div>
              </div>
            )}
          </div>

          <div className='checkout-container'>
            <form className="checkout-form" onSubmit={handleSubmit}>
              <p className="checkout-title">Checkout</p>
              <p className="checkout-message">Complete Your Purchase</p>
              <div className="checkout-flex">
                <label>
                  <input
                    className="checkout-input"
                    type="text"
                    name="fname"
                    value={form.fname}
                    onChange={handleChange}
                    required
                  />
                  <span>First Name</span>
                </label>

                <label>
                  <input
                    className="checkout-input"
                    type="text"
                    name="lname"
                    value={form.lname}
                    onChange={handleChange}
                    required
                  />
                  <span>Last Name</span>
                </label>
              </div>
              <label>
                <input
                  className="checkout-input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <span>Email</span>
              </label>

              <label>
                <input
                  className="checkout-input"
                  type="text"
                  name="number"
                  value={form.number}
                  onChange={handleChange}
                  required
                />
                <span>Phone Number</span>
              </label>

              <label>
                <input
                  className="checkout-input"
                  type="text"
                  name="amount"
                  value={form.amount}
                  readOnly
                />
              </label>
              <div className="check-btn-centre">
                <button className="PayBtn">
                  Check Details
                  <svg className="svgIcon" viewBox="0 0 576 512">
                    <path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"></path>
                  </svg>
                </button>
                
              </div>
            </form>
          </div>
        </div>
      )}
      {toggle === 2 && hash && transactionId && (
        <PayUPaymentPage
          hash={hash}
          transactionId={transactionId}
          form={form}
          setToggle={setToggle}
          selectedPlan={selectedPlan}
        />
      )}
    </>
  );
};

export default CheckoutPage;

import React from "react";
import '../Home.css';
import { Link } from "react-router-dom";

const Prices = () => {
  const [header] = React.useState({
    subHeading: "CHOOSE A PLAN",
    text: "Select the plan that best fits your needs:",
  });

const [plans] = React.useState([
  {
    id: "free",
    heading: "Free Plan",
    // price: "0",
    features: {
      permitGeneration: "10 Permits",
      automatedMailNotification: "No",
      analyticalDashboard: "Yes",
      reminderAndOverdueMailNotification: "No",
      assignRoles: "Yes",
      permitStatusTracking: "Yes",
      downloadPermitsInMultipleFormats: "No",
      sequentialPermitNumbering: "No",
      mailServiceSupport: "No",
      prioritySupport: "No",
      onSiteTraining: "No",
      emailTemplates: "No",
      automaticRenewalReminders: "No",
      supportTicketSystem: "No",
      customFormFields: "No",
      geolocationServices: "No",
    }
  },
  {
    id: "Premium",
    heading: "Premium Plan",
    // price: "2000",
    features: {
      permitGeneration: "500 Permits",
      automatedMailNotification: "Yes",
      analyticalDashboard: "Yes",
      reminderAndOverdueMailNotification: "No",
      assignRoles: "Yes",
      permitStatusTracking: "Yes",
      downloadPermitsInMultipleFormats: "No",
      sequentialPermitNumbering: "Yes",
      mailServiceSupport: "Yes",
      prioritySupport: "No",
      onSiteTraining: "No",
      emailTemplates: "No",
      automaticRenewalReminders: "No",
      supportTicketSystem: "No",
      customFormFields: "No",
      geolocationServices: "Yes",

    }
  },
  {
    id: "Enterprise",
    heading: "Enterprise Plan",
    // price: "20,000",
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
      emailTemplates: "Yes",
      automaticRenewalReminders: "Yes",
      supportTicketSystem: "Yes",
      customFormFields: "Yes",
      geolocationServices: "Yes"
    }
  }
]);


  return (
    <div className="prices">
      <div className="container">
        <div className="common">
          <h1 className="mainHeader">{header.subHeading}</h1>
          <p className="mainContent">{header.text}</p>
          <div className="commonBorder"></div>
        </div>
        <div className="centre-pricing-cards">
                <div className="pricing-cardss">
          {plans.map(plan => (
            <div className="price-cards" key={plan.id}>
              <div className="priceHeading">{plan.heading}</div>
              <div className="price__rs">
                {/* <span>Rs.</span> */}
                {plan.price}
              </div>
              <ul>
                {Object.entries(plan.features).map(([feature, value]) => (
                  <li key={feature}>
                    {feature.replace(/([A-Z])/g, ' $1').toUpperCase()}: {value}
                  </li>
                ))}
              </ul>
              <div className="price__btn">
                <button className="btn">
                  <svg height="24" width="24" fill="#FFFFFF" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" className="sparkle">
                    <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
                  </svg>
                  <Link to="/signup">
                    <span className="text">BUY NOW</span>
                  </Link>
                </button>
              </div>
            </div>
          ))}
        </div>
        </div>

      </div>
    </div>
  );
};

export default Prices;

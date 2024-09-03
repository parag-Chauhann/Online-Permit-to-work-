import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../../Firebase';
import "./PackageDetails.css"

const planDetails = {
  free: {
    heading: "Free Plan",
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
  Premium: {
    heading: "Premium Plan",
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
      emailTemplates: "Yes",
      automaticRenewalReminders: "Yes",
      supportTicketSystem: "Yes",
      customFormFields: "Yes",
      geolocationServices: "Yes",
    }
  }
};

const PackageDetails = () => {
  const [userData, setUserData] = useState(null);
  const [expirationDate, setExpirationDate] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, 'Users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);

            // Calculate expiration date
            if (data.purchaseDate) {
              const purchaseDate = data.purchaseDate.toDate();
              const expiryDate = new Date(purchaseDate);
              expiryDate.setMonth(expiryDate.getMonth() + 1); // Add 1 month
              setExpirationDate(expiryDate);

              // Check if expired and update paymentStatus
              if (new Date() > expiryDate) {
                await updateDoc(docRef, { paymentStatus: false });
              }
            }
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const checkNotification = () => {
      if (expirationDate) {
        const now = new Date();
        const daysLeft = Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24));
        setDaysLeft(daysLeft);
        if (daysLeft <= 2 && daysLeft > 0) {
          alert(`Your package will expire in ${daysLeft} days.`);
        }
      }
    };

    checkNotification(); // Check immediately
    const interval = setInterval(checkNotification, 24 * 60 * 60 * 1000); // Check daily

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [expirationDate]);

  const handleRenew = () => {
    // Redirect to the signup or renewal page
    window.location.href = '/login'; // Adjust path if needed
  };

  if (!userData) return <div>Loading...</div>;

  const isExpired = expirationDate && new Date() > expirationDate;
  const plan = planDetails[userData.selectedPlan];
  const permitLimit = plan ? plan.features.permitGeneration : '0';

  return (
    <div className="package-details">
      <h1>Package Details</h1>
      <p><strong>Name:</strong> {userData.firstName} {userData.lastName}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Date of Purchase:</strong> {userData.purchaseDate.toDate().toLocaleDateString()}</p>
      <p><strong>Expiry Date:</strong> {expirationDate.toLocaleDateString()}</p>
      <p><strong>Days Left:</strong> {daysLeft} days</p>
      <p><strong>Package Name:</strong> {userData.selectedPlan}</p>
      <p><strong>Permit Limit:</strong> {permitLimit}</p>
      <p><strong>Permits Created:</strong> {userData.permitsCreated}</p>
      <div className="plan-details">
        <h2>Package Details</h2>
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {plan?.features && Object.entries(plan.features).map(([feature, details]) => (
              <tr key={feature}>
                <td>{feature.replace(/([A-Z])/g, ' $1').trim()}</td>
                <td>{details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isExpired && <button onClick={handleRenew}>Renew</button>}
    </div>
  );
};

export default PackageDetails;

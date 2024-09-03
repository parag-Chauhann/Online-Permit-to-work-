import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PermitDashboard.css';
import { auth, db } from "../../Firebase";
import { getDoc, doc } from "firebase/firestore";

// Define permit types array with comprehensive list
const permitTypes = [
  { value: 'permitformelectrical', label: 'Electrical Permit' },
  { value: 'permitformlifting', label: 'Lifting Permit' },
  { value: 'workAtHeight', label: 'Work at Height Permit' },
  { value: 'confinedSpace', label: 'Confined Space Permit' },
  { value: 'fire', label: 'Fire Permit' },
  { value: 'environmental', label: 'Environmental Permit' },
  { value: 'hotWork', label: 'Hot Work Permit' },
  { value: 'coldWork', label: 'Cold Work Permit' },
  { value: 'excavation', label: 'Excavation Permit' },
  { value: 'demolition', label: 'Demolition Permit' },
  { value: 'chemical', label: 'Chemical Permit' },
  { value: 'radiation', label: 'Radiation Permit' }
];

function PermitDashboard() {
  const [selectedPermit, setSelectedPermit] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  const handlePermitChange = (e) => {
    setSelectedPermit(e.target.value);
  };

  const handlePermitSubmit = (e) => {
    e.preventDefault();
    if (selectedPermit) {
      // Navigate to CommonPermitForm with selected permit type
      navigate(`/${selectedPermit}`);
    }
  };

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          console.log("No user data found");
        }
      } else {
        console.log("User is not logged in");
      }
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="card-client">
        <div className="user-picture">
          <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
            <path d="M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z"></path>
          </svg>
        </div>
        <p className="name-client">
          {userDetails ? userDetails.firstName : 'Loading...'}
          <span>{userDetails ? userDetails.designation : 'Loading...'} at {userDetails ? userDetails.company : 'Loading...'}</span>
        </p>
        <div className="social-media">
          <p>WELCOME</p>
        </div>
      </div>

      <div className="permit-dashboard">
        <h2>Select a Permit Type</h2>
        <form className='permit-dashboard-form' onSubmit={handlePermitSubmit}>
          <select
            className="permit-dropdown"
            value={selectedPermit}
            onChange={handlePermitChange}
            required
          >
            <option value="" disabled>Select a permit</option>
            {permitTypes.map((permit) => (
              <option key={permit.value} value={permit.value}>
                {permit.label}
              </option>
            ))}
          </select>
          <button className="custom-button" type="submit">
            Fill Permit Form
            <svg fill="currentColor" viewBox="0 0 24 24" className="custom-icon">
              <path
                clipRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                fillRule="evenodd"></path>
            </svg>
          </button>
              </form>
              </div>
              </div>
  );
}

export default PermitDashboard;

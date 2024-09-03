// PermitForm.js
import { doc, setDoc, increment, updateDoc, getDoc, } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
// import { FaArrowCircleLeft, FaArrowCircleRight, FaMicrophone } from "react-icons/fa";
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { RxEnter } from "react-icons/rx";
import { emailjs, SERVICE_ID, TEMPLATE_ID, USER_ID } from '../../emailjsConfig'; 
import { db } from '../../Firebase';
import "./PermitForm.css";
import { getAuth } from 'firebase/auth';



function PermitForm({ riskAssociated, permitFormData, precautions, heading, inspectionItems, ppeItems }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [plantLocationOptions, setPlantLocationOptions] = useState([]);
    const [approversForDisplay, setApproversForDisplay] = useState([]);
    const [approverOptions, setApproverOptions] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [packageDetails, setPackageDetails] = useState({});
    const [permitsCreated, setPermitsCreated] = useState(0);
    const permitLimit = packageDetails.permitLimit || 0;
    const recognitionRef = useRef(null);
    const [formData, setFormData] = useState({
        ptwNumber: '',  
        contractorName: '',
        projectName: '',
        numberOfEmployees: '',
        startDate: '',
        completionDate: '',
        // liftingEquipment: '',
        // weight: '',
        // dimension: '',
        // quantity: '',
        // serialNumber: '',
        // inspectionDate: '',
        // capacity: '',
        currentLocation: '',
        jobDescription: '',
        Risks: [],
        precautions: {
            isDistanceMaintained: '',
            confinedSpaceAccess: '',
            electricalPowerIsolated: '',
            linesDeEnergized: '',
            toolsTested: ''
        },
        inspectedItems: [],
        otherInspectionItem: '',
        ppeItems: [],
        otherPPEItem: '',
        receiverName: '',
        receiverSignature: '',
        acceptanceDate: '',
        plantLocation: '',
        selectedApprovers: []
    });

    const auth = getAuth();
    const user = auth.currentUser;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleRiskChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prevState => {
            const Risks = checked
                ? [...prevState.Risks, value]
                : prevState.Risks.filter(risk => risk !== value);
            return { ...prevState, Risks };
        });
    };

    const handlePrecautionChange = (point, option) => {
        setFormData(prevState => ({
            ...prevState,
            precautions: {
                ...prevState.precautions,
                [point]: option
            }
        }));
    };

    const handleInspectionChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prevState => {
            const inspectedItems = checked
                ? [...prevState.inspectedItems, name]
                : prevState.inspectedItems.filter(item => item !== name);
            return { ...prevState, inspectedItems };
        });
    };

    const handlePPEChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prevState => {
            const ppeItems = checked
                ? [...prevState.ppeItems, name]
                : prevState.ppeItems.filter(item => item !== name);
            return { ...prevState, ppeItems };
        });
    };
    
    const handleApproverChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prevState => {
            const selectedApprovers = checked
                ? [...prevState.selectedApprovers, value]
                : prevState.selectedApprovers.filter(email => email !== value);

            return { ...prevState, selectedApprovers };
        });
    };

    const getCurrentLocation = () => {
        if (packageDetails.selectedPlan === "Free") {
            alert("Location option is not available for your plan.");
            return;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setFormData(prevState => ({
                        ...prevState,
                        currentLocation: `Latitude: ${latitude}, Longitude: ${longitude}`
                    }));
                },
                (error) => {
                    console.error("Error obtaining location", error);
                }
            );
        } else {
            alert("Geolocation is not supported / blocked by this browser, Please enable it");
        }
    };


    const handleNext = () => {
        setCurrentStep(prevStep => prevStep + 1);
    };

    const handleBack = () => {
        setCurrentStep(prevStep => prevStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            if (!user) {
                throw new Error("User is not authenticated.");
            }
    
            // Fetch the user's document
            const userDocRef = doc(db, 'Users', user.uid);
            const userDoc = await getDoc(userDocRef);
    
            if (!userDoc.exists()) {
                throw new Error("User data not found.");
            }
    
            const userData = userDoc.data();
            const adminUserId = userData.createdBy;
    
            if (!adminUserId) {
                throw new Error("Admin ID is not available for this user.");
            }
    
            // Fetch the admin's document
            const adminDocRef = doc(db, 'Users', adminUserId);
            const adminDoc = await getDoc(adminDocRef);
    
            if (!adminDoc.exists()) {
                throw new Error("Admin data not found.");
            }
    
            const adminData = adminDoc.data();
            const adminPlan = adminData.selectedPlan;
            const permitsCreatedByAdmin = adminData.permitsCreated || 0;
            const permitLimit = adminPlan === "Enterprise" ? Infinity 
                                : adminPlan === "Premium" ? 500 
                                : adminPlan === "Free" ? 10 
                                : 0;
    
            const permitsCreatedByUser = userData.permitsCreated || 0;
    
            // Check if the admin has reached their permit limit
            if (permitsCreatedByAdmin >= permitLimit) {
                alert("The admin has reached the maximum number of permits allowed by their package.");
                return;
            }
    
            // Check if the user has reached their permit limit
            if (permitsCreatedByUser >= permitLimit) {
                alert("You have reached the maximum number of permits allowed by your package.");
                return;
            }
    
            // Generate permit number
            const permitNumber = await generatePermitNumber(adminUserId);
    
            if (!permitNumber) {
                throw new Error("Permit number could not be generated.");
            }
    
            // Encode the permit number
            const encodedPermitNumber = encodeURIComponent(permitNumber);
    
            // Fetch PermitSettings collection
            const permitSettingsDocRef = doc(db, 'PermitSettings', 'settings'); // Replace 'settings' with the appropriate document ID
            const permitSettingsDoc = await getDoc(permitSettingsDocRef);
    
            if (!permitSettingsDoc.exists()) {
                // Handle missing PermitSettings document
                console.warn("PermitSettings document not found. Creating default settings.");
                // Optionally create a default PermitSettings document here
                await setDoc(permitSettingsDocRef, { defaultSetting: true });
            }
    
            const templateParams = {
                ptwNumber: permitNumber,
                contractorName: formData.contractorName,
                projectName: formData.projectName,
                details: `Weight: ${formData.weight}, 
                Dimension: ${formData.dimension}, 
                Quantity: ${formData.quantity}, 
                Serial Number: ${formData.serialNumber}, 
                Inspection Date: ${formData.inspectionDate}, 
                Capacity: ${formData.capacity}`,
                approvalLink: `http://localhost:3000/login?permitNumber=${encodedPermitNumber}` // Updated link format
            };
    
            if (typeof permitNumber !== 'string' || !permitNumber.trim()) {
                throw new Error("Invalid permit number.");
            }
    
            // Store the permit in Firestore under the permit number
            await setDoc(doc(db, 'permits', permitNumber), {
                ...formData,
                ptwNumber: permitNumber,
                status: 'Permit Initiated',
                receiverName: formData.receiverName,
                receiverSignature: formData.receiverSignature,
                acceptanceDate: formData.acceptanceDate,
                adminUserId: adminUserId,
                userId: user.uid
            });
    
            console.log("Permit data uploaded to Firestore.");
    
            // Increment the number of permits created for the user
            await updateDoc(userDocRef, {
                permitsCreated: increment(1)
            });
    
            console.log("User permits created count updated.");
    
            // Increment the number of permits created for the admin
            await updateDoc(adminDocRef, {
                permitsCreated: increment(1)
            });
    
            console.log("Admin permits created count updated.");
    
            // Increment the counter for permit numbers
            const counterDocRef = doc(db, 'counters', adminUserId);
            await updateDoc(counterDocRef, {
                currentNumber: increment(1)
            });
    
            console.log("Admin's current permit number counter updated.");
    
            // Send approval emails
            for (const approver of formData.selectedApprovers) {
                try {
                    await emailjs.send(SERVICE_ID, TEMPLATE_ID, { ...templateParams, to_email: approver }, USER_ID);
                    console.log(`Email sent to ${approver}`);
                } catch (emailError) {
                    console.error(`Failed to send email to ${approver}:`, emailError);
                }
            }
    
            alert("PTW form is submitted and approval emails have been sent.");
        } catch (error) {
            console.error("Failed to submit form:", error);
            alert("Failed to submit form. Please try again later.");
        }
    };
    
    
    useEffect(() => {
    const fetchUserPackageDetails = async () => {
        if (user) {
            const userDocRef = doc(db, 'Users', user.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                console.log("User Data:", userData); // Log user data

                // Set package details and other user info
                setPackageDetails(userData.package || {});
                setPermitsCreated(userData.permitsCreated || 0);

                // Verify the package details
                const selectedPlan = userData.selectedPlan;
                console.log("Selected Plan:", selectedPlan); // Log selected plan

                // Apply plan-specific logic
                if (selectedPlan === "Free") {
                    // Free Plan logic
                    console.log("Free Plan: Manual permit number, No location option.");
                    // Disable location option
                    setFormData(prevState => ({
                        ...prevState,
                        currentLocation: ''
                    }));
                } else if (selectedPlan === "Premium" || selectedPlan === "Enterprise") {
                    // Premium or Enterprise Plan logic
                    console.log("Premium/Enterprise Plan: Auto-generated permit number, Location option available.");
                    // Enable location option
                    setFormData(prevState => ({
                        ...prevState,
                        currentLocation: prevState.currentLocation // Maintain location field
                    }));
                    
                    // Auto-generate permit number
                    const ptwNumber = await generatePermitNumber(user.uid);
                    if (ptwNumber) {
                        setFormData(prevState => ({
                            ...prevState,
                            ptwNumber
                        }));
                    }
                } else {
                    console.error("Unknown plan type.");
                }
            } else {
                console.error("User data not found.");
            }
        }
    };

    fetchUserPackageDetails();
}, [user]);


useEffect(() => {
    const fetchAreasAndApprovers = async () => {
        if (user) {
            try {
                // Fetch user document
                const userDocRef = doc(db, 'Users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (!userDoc.exists()) {
                    throw new Error("User data not found.");
                }

                const userData = userDoc.data();
                const adminUserId = userData.createdBy;

                if (!adminUserId) {
                    throw new Error("Admin ID is not available for this user.");
                }

                // Fetch admin document
                const adminDocRef = doc(db, 'admins', adminUserId);
                const adminDoc = await getDoc(adminDocRef);

                if (!adminDoc.exists()) {
                    throw new Error("Admin data not found.");
                }

                const adminData = adminDoc.data();
                const areas = adminData.areas || [];
                const approvers = adminData.approvers || {};

                console.log("Fetched areas:", areas); // Debugging
                console.log("Fetched approvers:", approvers); // Debugging

                if (areas.length === 0) {
                    console.warn("No areas found for this admin."); // Debugging
                }

                // Set plant location options
                setPlantLocationOptions([{ value: '', label: 'Select Location' }, ...areas.map(area => ({ value: area, label: area }))]);

                // Set approver options
                const approversOptions = {};
                for (const [area, approverList] of Object.entries(approvers)) {
                    approversOptions[area] = approverList.map(approver => ({
                        email: approver.email,
                        name: approver.name,
                        label: `${approver.name} (${approver.email})`
                    }));
                }
                setApproverOptions(approversOptions);

                console.log("Approver options set:", approversOptions); // Debugging

                // Optionally set package details
                setPackageDetails(userData.package || {});

            } catch (error) {
                console.error("Error fetching areas and approvers:", error);
            }
        }
    };

    fetchAreasAndApprovers();
}, [user]);


    useEffect(() => {
        if (formData.plantLocation) {
            setApproversForDisplay(approverOptions[formData.plantLocation] || []);
        }
    }, [formData.plantLocation, approverOptions]);

    const generatePermitNumber = async (adminUserId) => {
        try {
            // Reference to the PermitSettings document for the admin
            const settingsDocRef = doc(db, 'PermitSettings', adminUserId);
            const settingsDoc = await getDoc(settingsDocRef);
    
            if (!settingsDoc.exists()) {
                console.error("PermitSettings not found.");
                return null;
            }
    
            const settingsData = settingsDoc.data();
            const permitFormat = settingsData.permitFormat; // e.g., "TTPL/WC1L/PTW"
    
            if (!permitFormat) {
                console.error("Permit format not defined in PermitSettings.");
                return null;
            }
    
            // Fetch the counter document for the admin
            const counterDocRef = doc(db, 'counters', adminUserId);
            const counterDoc = await getDoc(counterDocRef);
    
            let currentNumber = 0;
    
            if (!counterDoc.exists()) {
                // Create the counter document with initial value of 0
                await setDoc(counterDocRef, { currentNumber: 0 });
                console.log("Counter document created with initial value 0.");
            } else {
                const counterData = counterDoc.data();
                currentNumber = counterData.currentNumber || 0;
            }
    
            // Determine the next serial number
            const nextSerialNumber = (currentNumber + 1).toString().padStart(2, '0');
    
            // Format the new permit number
            const newPermitNumber = `${permitFormat}-${nextSerialNumber}`;
    
            // Update the counter to the next number
            await updateDoc(counterDocRef, { currentNumber: increment(1) });
    
            return newPermitNumber;
        } catch (error) {
            console.error('Error generating permit number:', error);
            return null;
        }
    };
    
    const startVoiceRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
        if (!SpeechRecognition) {
          alert("Speech Recognition is not supported in this browser.");
          return;
        }
    
        if (isListening) {
          // Stop speech recognition if it's currently listening
          if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
            console.log("Voice recognition stopped.");
            alert("Speech recognition ended.");
          }
        } else {
          // Start speech recognition if it's not currently listening
          const recognition = new SpeechRecognition();
          recognition.lang = 'en-IN';
          recognition.interimResults = true;
          recognition.maxAlternatives = 1;
    
          recognitionRef.current = recognition;
          recognition.start();
          setIsListening(true);
    
          recognition.onstart = () => {
            console.log("Voice recognition started. Speak now.");
          };
    
          recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
              .map(result => result[0].transcript)
              .join('');
            console.log("Speech recognized: ", transcript);
            // Handle the recognized speech transcript here
          };
    
          recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
          };
    
          recognition.onend = () => {
            setIsListening(false);
            console.log("Voice recognition ended.");
            
          };
        }
      };

    return (
        <div className='Permitform-MainBody'> 
        <div className='permit-form-container'>
            <div className='permit-form-subcontainer'>
                <form onSubmit={handleSubmit}>
                <header>{heading} Permit Form</header>
                    {currentStep === 1 && (
                        <div className='form first animate__animated animate__fadeIn'>
                            <div className='details personal'>
                                <span className='title'>Permit form</span>
                                <div className='fields'>
                                    {permitFormData.map((item, index) => (
                                        <div className='input-fields' key={index}>
                                            <label>{item.label}</label>
                                            <input
                                                type={item.type}
                                                name={item.name}
                                                placeholder={item.placeholder}
                                                value={formData[item.name]}
                                                onChange={handleChange}
                                                required
                                                readOnly={item.readOnly || false} // Apply the readOnly attribute conditionally
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        
                            <div className='details electrical-risks'>
                                <span className='title'>Identify risk associated with this {heading} work</span>
                                <table className='electrical-risks-table'>
                                    <thead>
                                        <tr>
                                            <th>Risk</th>
                                            <th>Select</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {riskAssociated.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.label}</td>
                                                <td>
                                                    <input
                                                        type='checkbox'
                                                        value={item.value}
                                                        checked={formData.Risks.includes(item.value)}
                                                        onChange={handleRiskChange}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className='details precautions'>
                                <span className='title'>Precaution required to complete the {heading} work safely</span>
                                <table className='precautions-table'>
                                    <thead>
                                        <tr>
                                            <th>Precaution</th>
                                            <th>YES</th>
                                            <th>NO</th>
                                            <th>Not Applicable</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {precautions.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.label}</td>
                                                <td>
                                                    <input
                                                        type='radio'
                                                        name={item.point}
                                                        value='YES'
                                                        checked={formData.precautions[item.point] === 'YES'}
                                                        onChange={() => handlePrecautionChange(item.point, 'YES')}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type='radio'
                                                        name={item.point}
                                                        value='NO'
                                                        checked={formData.precautions[item.point] === 'NO'}
                                                        onChange={() => handlePrecautionChange(item.point, 'NO')}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type='radio'
                                                        name={item.point}
                                                        value='NA'
                                                        checked={formData.precautions[item.point] === 'NA'}
                                                        onChange={() => handlePrecautionChange(item.point, 'NA')}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className='details inspection-items'>
                                <span className='title'>The following areas / items have been inspected by issuer and receiver</span>
                                <table className='inspection-items-table'>
                                    <thead>
                                        <tr>
                                            <th>Inspection Item</th>
                                            <th>Tick</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inspectionItems.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    {item.label}
                                                    {item.label === 'Other (Specify)' && (
                                                        <input
                                                            type='text'
                                                            name='otherInspectionItem'
                                                            placeholder='Specify'
                                                            value={formData.otherInspectionItem || ''}
                                                            onChange={handleChange}
                                                            style={{ marginLeft: '10px' }}
                                                        />
                                                    )}
                                                </td>
                                                <td>
                                                    <input
                                                        type='checkbox'
                                                        name={item.value}
                                                        checked={formData.inspectedItems.includes(item.value)}
                                                        onChange={handleInspectionChange}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        
                            <div className='details ppe-required'>
                                <span className='title'>PPE Required for the Activity</span>
                                <table className='ppe-table'>
                                    <thead>
                                        <tr>
                                            <th>PPE Item</th>
                                            <th>Tick</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ppeItems.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    {item.label}
                                                    {item.value === 'other' && (
                                                        <input
                                                            type='text'
                                                            name='otherPPEItem'
                                                            placeholder='Specify'
                                                            value={formData.otherPPEItem || ''}
                                                            onChange={handleChange}
                                                            style={{ marginLeft: '10px' }}
                                                        />
                                                    )}
                                                </td>
                                                <td>
                                                    <input
                                                        type='checkbox'
                                                        name={item.value}
                                                        checked={formData.ppeItems.includes(item.value)}
                                                        onChange={handlePPEChange}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        
                            <div className='details location'>
                                <span className='title'>Plant Location</span>
                                <div className='fields'>
                                    <div className='input-fields'>
                                        <label>Plant Location</label>
                                        <select
                                            name="plantLocation"
                                            value={formData.plantLocation}
                                            onChange={handleChange}
                                            required
                                        >
                                            {plantLocationOptions.map((option, index) => (
                                                <option key={index} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        
                            <div className='details approvers'>
                                <span className='title'>Approvers</span>
                                <div className='fields'>
                                    {Array.isArray(approversForDisplay) && approversForDisplay.map((approver, index) => (
                                        <div className='input-fields' key={index}>
                                            <input
                                                type="checkbox"
                                                id={`approver-${index}`}
                                                value={approver.email}
                                                onChange={handleApproverChange}
                                            />
                                            <label htmlFor={`approver-${index}`}>
                                                {approver.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='permit-filling-section-btn-main'>

                            <button className="permit-filling-section-btn" type="button" onClick={handleNext}>
                                Next
                                <div className="permit-filling-section-arrow-wrapper">
                                    <div className="permit-filling-section-arrow"></div>
                                </div>
                            </button>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="form second animate__animated animate__fadeIn">
                            <div className='details job-description'>
                                <span className='title'>Job Description</span>
                                <div className='fields'>
                                    <div className='input-fields'>
                                        <label>Description</label>
                                        <textarea
                                            style={{ width: '100%' }}
                                            rows={10}
                                            name="jobDescription"
                                            value={formData.jobDescription}
                                            onChange={handleChange}
                                            placeholder="Describe the job"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="voice-control">
                                <input 
                                type="checkbox" 
                                id="checkbox" 
                                checked={isListening}
                                onChange={startVoiceRecognition}
                                />
                                <label className="switch" htmlFor="checkbox">
                                    <div className="mic-on">
                                        <FaMicrophone />
                                        </div>
                                        <div className="mic-off">
                                            <FaMicrophoneSlash />
                                        </div>
                                </label>
                            </div>
                            <div className='details location'>
                                <span className='title'>Current Location</span>
                                <div className='fields'>
                                    <div className='input-fields'>
                                        <label>Current Location</label>
                                        <input
                                            type="text"
                                            name="currentLocation"
                                            value={formData.currentLocation}
                                            readOnly
                                        />
                                        <div class="loader" onClick={getCurrentLocation}>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        
                            <div className='details issue-acceptance'>
                                <span className='title'>Issue and Acceptance</span>
                                <div className='fields'>
                                    <div className='input-fields'>
                                        <p>
                                            I certify that I have read and verified this work permit and checklist. I have been informed about the risk assessment results, I am aware of the risks that could be exposed, and I commit to following all safety rules mentioned in the work permit checklist and will not deviate from them.
                                        </p>
                                        <label>Receiver's Name</label>
                                        <input
                                            type="text"
                                            name="receiverName"
                                            value={formData.receiverName}
                                            onChange={handleChange}
                                            placeholder="Enter receiver's name"
                                            required
                                        />
                                    </div>
                                    <div className='input-fields'>
                                        <label>Receiver's Signature</label>
                                        <input
                                            type="text"
                                            name="receiverSignature"
                                            value={formData.receiverSignature}
                                            onChange={handleChange}
                                            placeholder="Enter receiver's signature"
                                            required
                                        />
                                    </div>
                                    <div className='input-fields'>
                                        <label>Date</label>
                                        <input
                                            type="date"
                                            name="receiverDate"
                                            value={formData.receiverDate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        
                            <div className='permit-filling-section-btn-main'>
                                <button className="permit-filling-back-btn" onClick={handleBack}>
                                    <div className="permit-filling-back-arrow-wrapper">
                                        <div className="permit-filling-back-arrow"></div>
                                        </div>
                                        Back
                                        </button>

                                
                                <button className="permit-filling-section-btn" type="submit" >
                                Submit
                                <div className="permit-filling-section-arrow-wrapper">
                                    <div className="permit-filling-section-arrow"></div>
                                </div>
                            </button>
                            </div>
                        </div>
                        )}
                        
                        {permitsCreated >= packageDetails.permitLimit && (
                            <div className="notification">
                                <p>You have reached the maximum number of permits allowed by your package.</p>
                            </div>)}
                </form>
            </div>
        </div>
        </div>
    );
} 

export default PermitForm;
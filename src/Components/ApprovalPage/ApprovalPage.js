import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../../Firebase';
import { emailjs, SERVICE_ID, USER_ID, TEMPLATE_ID_APPROVAL, TEMPLATE_ID_REJECTION } from '../../emailjsConfig';
import './ApprovalPage.css';
import { useParams } from 'react-router-dom';

function ApprovalPage() {
    const [permitData, setPermitData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [issuerName, setIssuerName] = useState('');
    const [issuerSignature, setIssuerSignature] = useState('');
    const [issuerDate, setIssuerDate] = useState('');
    const [safetyDepartments, setSafetyDepartments] = useState([]);
    const [selectedSafetyEmail, setSelectedSafetyEmail] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const { permitNumber } = useParams();

    useEffect(() => {
        const fetchPermitData = async () => {
            try {
                const decodedPermitNumber = decodeURIComponent(permitNumber);
                const docRef = doc(db, 'permits', decodedPermitNumber);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setPermitData(data);

                    // Fetch safety departments for the specific admin
                    fetchSafetyDepartments(data.adminUserId);
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching permit data:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchSafetyDepartments = async (adminId) => {
            try {
                if (!adminId) return; // Ensure adminId is available

                // Query to get safety departments added by this admin
                const q = query(collection(db, 'SafetyDepartments'), where('adminId', '==', adminId));
                const querySnapshot = await getDocs(q);

                const departmentsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setSafetyDepartments(departmentsList);
            } catch (error) {
                console.error("Error fetching safety departments: ", error);
            }
        };

        fetchPermitData();
    }, [permitNumber]);

    const handleApproval = async () => {
        if (!issuerName || !issuerSignature || !issuerDate || !selectedSafetyEmail) {
            alert('Please fill all fields and select a safety department.');
            return;
        }

        try {
            const decodedPermitNumber = decodeURIComponent(permitNumber);
            const docRef = doc(db, 'permits', decodedPermitNumber);
            await updateDoc(docRef, {
                status: 'Approved by First Approver',
                issuerName,
                issuerSignature,
                issuerDate,
            });

            if (selectedSafetyEmail) {
                await emailjs.send(SERVICE_ID, TEMPLATE_ID_APPROVAL, {
                    ptwNumber: permitData.ptwNumber,
                    contractorName: permitData.contractorName,
                    projectName: permitData.projectName,
                    startDate: permitData.startDate,
                    completionDate: permitData.completionDate,
                    permitNumber: permitData.ptwNumber, // Ensure this matches the placeholder in your template
                    // reviewLink: `https://online-permit-to-work.vercel.app//safety-approve/${encodeURIComponent(permitData.ptwNumber)}`, // Ensure this is the correct URL
                    reviewLink: `http://localhost:3000/safety-approve/${encodeURIComponent(permitData.ptwNumber)}`, // Ensure this is the correct URL
                    
                    to_email: selectedSafetyEmail
                }, USER_ID);
            }

            alert('Permit approved and notification sent.');
        } catch (error) {
            console.error('Error handling approval:', error);
        }
    };

    const handleRejection = () => {
        setShowPopup(true);
    };

    const confirmRejection = async () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a reason for rejection.');
            return;
        }

        if (!issuerName || !issuerSignature || !issuerDate) {
            alert('Please fill all fields.');
            return;
        }

        setShowPopup(false);
        try {
            const decodedPermitNumber = decodeURIComponent(permitNumber);
            const docRef = doc(db, 'permits', decodedPermitNumber);
            await updateDoc(docRef, {
                status: 'Rejected',
                issuerName,
                issuerSignature,
                issuerDate,
            });

            await emailjs.send(SERVICE_ID, TEMPLATE_ID_REJECTION, {
                ptwNumber: permitData.ptwNumber,
                contractorName: permitData.contractorName,
                projectName: permitData.projectName,
                startDate: permitData.startDate,
                completionDate: permitData.completionDate,
                // reviewLink: `https://online-permit-to-work.vercel.app/safety-approve/${encodeURIComponent(permitData.ptwNumber)}` // Ensure this is the correct URL
                reviewLink: `http://localhost:3000/safety-approve/${encodeURIComponent(permitData.ptwNumber)}` // Ensure this is the correct URL

            }, USER_ID);
            
            alert('Permit rejected and notification sent.');
        } catch (error) {
            console.error('Error handling rejection:', error);
        } finally {
            setRejectionReason('');
        }
    };

    const cancelRejection = () => {
        setShowPopup(false);
        setRejectionReason('');
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!permitData) {
        return <div className="error">No permit data found.</div>;
    }

    return (
        <div className="approval-page">
            <h1>Permit Approval</h1>
            <div className="permit-details">
                <h2>Basic Details</h2>
                <table className="details-table">
                    <tbody>
                        <tr>
                            <td>PTW Number:</td>
                            <td>{permitData.ptwNumber}</td>
                        </tr>
                        <tr>
                            <td>Contractor Name:</td>
                            <td>{permitData.contractorName}</td>
                        </tr>
                        <tr>
                            <td>Project Name:</td>
                            <td>{permitData.projectName}</td>
                        </tr>
                        <tr>
                            <td>Number of Employees:</td>
                            <td>{permitData.numberOfEmployees}</td>
                        </tr>
                        <tr>
                            <td>Start Date:</td>
                            <td>{permitData.startDate}</td>
                        </tr>
                        <tr>
                            <td>Completion Date:</td>
                            <td>{permitData.completionDate}</td>
                        </tr>
                        <tr>
                            <td>Current Location:</td>
                            <td>{permitData.currentLocation}</td>
                        </tr>
                        <tr>
                            <td>Job Description:</td>
                            <td>{permitData.jobDescription}</td>
                        </tr>
                    </tbody>
                </table>

                <h2>Risks</h2>
                <ul className="list">
                    {permitData.Risks && permitData.Risks.map((risk, index) => (
                        <li key={index}>{risk}</li>
                    ))}
                </ul>

                <h2>Precautions</h2>
                <table className="details-table">
                    <tbody>
                        {Object.entries(permitData.precautions).map(([key, value]) => (
                            <tr key={key}>
                                <td>{key.replace(/([A-Z])/g, ' $1')}:</td>
                                <td>{value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2>Inspection Items</h2>
                <ul className="list">
                    {permitData.inspectedItems && permitData.inspectedItems.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                    {permitData.otherInspectionItem && (
                        <li>Other: {permitData.otherInspectionItem}</li>
                    )}
                </ul>

                <h2>PPE Required</h2>
                <ul className="list">
                    {permitData.ppeItems && permitData.ppeItems.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                    {permitData.otherPPEItem && (
                        <li>Other: {permitData.otherPPEItem}</li>
                    )}
                </ul>

                <h2>Issue and Acceptance</h2>
                <table className="details-table">
                    <tbody>
                        <tr>
                            <td>Receiver's Name:</td>
                            <td>{permitData.receiverName}</td>
                        </tr>
                        <tr>
                            <td>Receiver's Signature:</td>
                            <td>{permitData.receiverSignature}</td>
                        </tr>
                        <tr>
                            <td>Acceptance Date:</td>
                            <td>{permitData.acceptanceDate}</td>
                        </tr>
                    </tbody>
                </table>

                <h2>Plant Location</h2>
                <p>{permitData.plantLocation}</p>

                <h2>Authority to Process by Authorized Person (Issuer)</h2>
                <p>
                    I have reviewed the work permission checklist and checked the working conditions. I have reviewed all aspects of the task/activity and am satisfied with the arrangements as detailed in the risk assessment. I certify that the activity detailed above is authorized to proceed.
                </p>
                <form>
                    <label className="form-label">
                        Issuer's Name:
                        <input
                            type="text"
                            value={issuerName}
                            onChange={(e) => setIssuerName(e.target.value)}
                        />
                    </label>
                    <label className="form-label">
                        Issuer's Signature:
                        <input
                            type="text"
                            value={issuerSignature}
                            onChange={(e) => setIssuerSignature(e.target.value)}
                        />
                    </label>
                    <label className="form-label">
                        Date:
                        <input
                            type="date"
                            value={issuerDate}
                            onChange={(e) => setIssuerDate(e.target.value)}
                        />
                    </label>

                    <label className="form-label">
                        Select Safety Department:
                        <select
                            value={selectedSafetyEmail}
                            onChange={(e) => setSelectedSafetyEmail(e.target.value)}
                        >
                            <option value="">Select an option</option>
                            {safetyDepartments.map((dept) => (
                                <option key={dept.id} value={dept.email}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <button type="button" onClick={handleApproval}>Approve</button>
                    <button type="button" onClick={handleRejection}>Reject</button>
                </form>
            </div>

            {showPopup && (
                <div className="popup">
                    <h3>Rejection Reason</h3>
                    <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                    />
                    <button onClick={confirmRejection}>Confirm</button>
                    <button onClick={cancelRejection}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default ApprovalPage;

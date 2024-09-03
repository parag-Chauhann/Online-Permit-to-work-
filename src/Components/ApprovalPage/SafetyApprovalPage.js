import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase'; // Adjust path if needed
import { emailjs, SERVICE_ID, USER_ID } from '../../emailjsConfig';
import { useParams } from 'react-router-dom';
import './SafetyApprovalPage.css';

function SafetyApprovalPage() {
    const { permitNumber } = useParams(); // Get permit number from route params
    const [permitData, setPermitData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [firstApproverEmail, setFirstApproverEmail] = useState('');
    const [contractorAcknowledgement, setContractorAcknowledgement] = useState({
        name: '',
        signature: '',
        date: '',
    });

    useEffect(() => {
        const fetchPermitData = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, 'permits', permitNumber);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setPermitData(data);
                    setFirstApproverEmail(data.firstApproverEmail || '');
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching permit data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPermitData();
    }, [permitNumber]);

    const handleApproval = async () => {
        try {
            const docRef = doc(db, 'permits', permitNumber);
            await updateDoc(docRef, { status: 'Approved by Safety Department' });

            // Send email notifications
            await emailjs.send(SERVICE_ID, "TEMPLATE_ID_SAFETY", {
                permitNumber,
                recipientEmail: permitData.safetyDepartmentEmail,
                userEmail: permitData.userEmail,
                firstApproverEmail,
                status: 'Approved',
            }, USER_ID);

            alert('Permit approved and notifications sent.');
        } catch (error) {
            console.error('Error updating permit status:', error);
        }
    };

    const handleRejection = async () => {
        try {
            const docRef = doc(db, 'permits', permitNumber);
            await updateDoc(docRef, { status: 'Rejected by Safety Department' });

            // Send email notifications
            await emailjs.send(SERVICE_ID, "TEMPLATE_ID_SAFETY", {
                permitNumber,
                recipientEmail: permitData.userEmail,
                userEmail: permitData.userEmail,
                firstApproverEmail,
                status: 'Rejected',
            }, USER_ID);

            alert('Permit rejected and notifications sent.');
        } catch (error) {
            console.error('Error updating permit status:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!permitData) {
        return <div>No permit data found.</div>;
    }

    return (
        <div className="safety-approval-page">
            <h1>Safety Department Approval</h1>
            <div className="permit-details">
                <h2>Basic Details</h2>
                <p><strong>PTW Number:</strong> {permitData.ptwNumber}</p>
                <p><strong>Contractor Name:</strong> {permitData.contractorName}</p>
                <p><strong>Project Name:</strong> {permitData.projectName}</p>
                <p><strong>Number of Employees:</strong> {permitData.numberOfEmployees}</p>
                <p><strong>Start Date:</strong> {permitData.startDate}</p>
                <p><strong>Completion Date:</strong> {permitData.completionDate}</p>

                <h2>Additional Details</h2>
                <p><strong>Plant Location:</strong> {permitData.plantLocation}</p>
                <p><strong>Current Location:</strong> {permitData.currentLocation}</p>
                <p><strong>Job Description:</strong> {permitData.jobDescription}</p>

                <h2>Electrical Risks</h2>
                <ul>
                    {permitData.electricalRisks && permitData.electricalRisks.length > 0 ? (
                        permitData.electricalRisks.map((risk, index) => (
                            <li key={index}>{risk}</li>
                        ))
                    ) : (
                        <li>No electrical risks listed.</li>
                    )}
                </ul>

                <h2>Precautions</h2>
                <ul>
                    {permitData.precautions && Object.entries(permitData.precautions).length > 0 ? (
                        Object.entries(permitData.precautions).map(([key, value]) => (
                            <li key={key}>
                                {key.replace(/([A-Z])/g, ' $1')}: {value}
                            </li>
                        ))
                    ) : (
                        <li>No precautions listed.</li>
                    )}
                </ul>

                <h2>Inspection Items</h2>
                <ul>
                    {permitData.inspectedItems && permitData.inspectedItems.length > 0 ? (
                        permitData.inspectedItems.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))
                    ) : (
                        <li>No inspected items listed.</li>
                    )}
                    {permitData.otherInspectionItem && (
                        <li>Other: {permitData.otherInspectionItem}</li>
                    )}
                </ul>

                <h2>PPE Required</h2>
                <ul>
                    {permitData.ppeItems && permitData.ppeItems.length > 0 ? (
                        permitData.ppeItems.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))
                    ) : (
                        <li>No PPE items listed.</li>
                    )}
                    {permitData.otherPPEItem && (
                        <li>Other: {permitData.otherPPEItem}</li>
                    )}
                </ul>

                <h2>Issue and Acceptance</h2>
                <p><strong>Receiver's Name:</strong> {permitData.receiverName}</p>
                <p><strong>Receiver's Signature:</strong> {permitData.receiverSignature}</p>
                <p><strong>Acceptance Date:</strong> {permitData.acceptanceDate}</p>

                <h2>Approved By</h2>
                <p><strong>First Approver Email:</strong> {firstApproverEmail}</p>

                <h2>Contractor Safety Engineer / Officer Acknowledgement</h2>
                <p>I have reviewed the work permit and verified the entire checklist corresponding to the workplace. All necessary control measures have been taken according to the risk assessment and additional precautions are implemented.</p>
                <p><strong>Name:</strong> <input type="text" value={contractorAcknowledgement.name} onChange={(e) => setContractorAcknowledgement({ ...contractorAcknowledgement, name: e.target.value })} /></p>
                <p><strong>Signature:</strong> <input type="text" value={contractorAcknowledgement.signature} onChange={(e) => setContractorAcknowledgement({ ...contractorAcknowledgement, signature: e.target.value })} /></p>
                <p><strong>Date:</strong> <input type="date" value={contractorAcknowledgement.date} onChange={(e) => setContractorAcknowledgement({ ...contractorAcknowledgement, date: e.target.value })} /></p>

                <div className="approval-actions">
                    <button onClick={handleApproval}>Approve</button>
                    <button onClick={handleRejection}>Reject</button>
                </div>
            </div>
        </div>
    );
}

export default SafetyApprovalPage;

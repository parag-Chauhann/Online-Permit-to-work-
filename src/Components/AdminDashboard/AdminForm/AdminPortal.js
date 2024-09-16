import React, { useState, useEffect } from 'react';
import { db } from '../../../Firebase';
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; // Import the necessary Firebase Auth functions
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal';
import './AdminPortal.css';

const AdminPortal = () => {
    const [areas, setAreas] = useState([]);
    const [approvers, setApprovers] = useState({});
    const [selectedArea, setSelectedArea] = useState('');
    const [newApprover, setNewApprover] = useState({
        name: '', email: '', password: '', area: '', department: '', designation: '', employeeId: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({});
    const [adminDocId, setAdminDocId] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                const adminDocId = user.uid;
                try {
                    const adminDocRef = doc(db, 'admins', adminDocId);
                    const docSnap = await getDoc(adminDocRef);

                    if (docSnap.exists()) {
                        const adminData = docSnap.data();
                        setAdminDocId(adminDocId);
                        setAreas(adminData.areas || []);
                        
                        const approversData = {};
                        for (const area of adminData.areas || []) {
                            approversData[area] = adminData.approvers[area] || [];
                        }
                        setApprovers(approversData);
                    } else {
                        console.log('Document does not exist. Creating new document.');
                        await setDoc(adminDocRef, { areas: [], approvers: {} });
                        setAdminDocId(adminDocId);
                    }
                } catch (error) {
                    console.error('Error fetching admin document:', error);
                }
            } else {
                console.error('No user is currently logged in.');
            }
        };
        fetchData();
    }, []);

    const handleAddApprover = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
    
        if (user) {
            const adminDocId = user.uid;
            const adminDocRef = doc(db, 'admins', adminDocId);
    
            if (!newApprover.area) {
                setError('Please select an area.');
                return;
            }
    
            if (!newApprover.name || !newApprover.email || !newApprover.password) {
                setError('Please enter all required fields (name, email, and password).');
                return;
            }
    
            try {
                // Create a new user in Firebase Auth
                const userCredential = await createUserWithEmailAndPassword(auth, newApprover.email, newApprover.password);
                const newUid = userCredential.user.uid;
    
                // Prepare new approver data
                const newApproverData = {
                    ...newApprover,
                    createdBy: adminDocId,
                    isAdmin: false,
                    paymentStatus: true, // Adjust as needed
                    selectedPlan: "Free",
                    uid: newUid,
                    isApprover : true,
                };
    
                // Add the approver to the `Users` collection
                await setDoc(doc(db, 'Users', newUid), newApproverData);
    
                // Fetch the current admin data
                const adminSnap = await getDoc(adminDocRef);
                if (!adminSnap.exists()) {
                    console.error('Admin document does not exist.');
                    return;
                }
    
                const adminData = adminSnap.data();
    
                // Check if the approver already exists in the selected area
                const approversForArea = approvers[newApprover.area] || [];
                if (approversForArea.some(approver => approver.email === newApprover.email)) {
                    setError('Approver with this email already exists in the selected area.');
                    return;
                }
    
                // Add the new approver to the area
                approversForArea.push(newApproverData);
    
                // Update Firestore document
                await updateDoc(adminDocRef, {
                    [`approvers.${newApprover.area}`]: approversForArea
                });
    
                // Update local state
                setApprovers({ ...approvers, [newApprover.area]: approversForArea });
                setNewApprover({ name: '', email: '', area: '', password: '', department: '', designation: '', employeeId: '' });
                setError('');
            } catch (error) {
                console.error('Error adding approver:', error);
                setError('Failed to add approver.');
            }
        } else {
            console.error('No user is currently logged in.');
        }
    };
    
    
    
    const handleRemoveApprover = async (area, email) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const adminDocId = user.uid;

            if (adminDocId) {
                const approversForArea = approvers[area].filter(approver => approver.email !== email);
                const adminDocRef = doc(db, 'admins', adminDocId);
                await updateDoc(adminDocRef, {
                    [`approvers.${area}`]: approversForArea
                });
                setApprovers({ ...approvers, [area]: approversForArea });
            } else {
                console.error('Admin Document ID is not set');
            }
        } else {
            console.error('No user is currently logged in.');
        }
    };

    const handleAddArea = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const adminDocId = user.uid;

            if (adminDocId) {
                if (selectedArea && !areas.includes(selectedArea)) {
                    const adminDocRef = doc(db, 'admins', adminDocId);
                    await updateDoc(adminDocRef, {
                        areas: [...areas, selectedArea],
                        [`approvers.${selectedArea}`]: []
                    });
                    setAreas([...areas, selectedArea]);
                    setSelectedArea('');
                    setError('');
                } else {
                    setError('Please enter a valid area name.');
                }
            } else {
                console.error('Admin Document ID is not set');
            }
        } else {
            console.error('No user is currently logged in.');
        }
    };

    const handleEdit = (area) => {
        setEditData({
            area,
            newName: area,
            approvers: approvers[area] || []
        });
        setEditMode(true);
    };

    const handleSaveEdit = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const adminDocId = user.uid;

            if (adminDocId) {
                const { area, newName, approvers } = editData;

                if (newName !== area) {
                    const adminDocRef = doc(db, 'admins', adminDocId);
                    await updateDoc(adminDocRef, {
                        areas: areas.map(a => (a === area ? newName : a)),
                        [`approvers.${newName}`]: approvers
                    });

                    const { [area]: _, ...remainingApprovers } = approvers;
                    await updateDoc(adminDocRef, {
                        [`approvers`]: remainingApprovers
                    });
                    setAreas(areas.map(a => (a === area ? newName : a)));
                } else {
                    await updateDoc(doc(db, 'admins', adminDocId), {
                        [`approvers.${area}`]: approvers
                    });
                }

                setEditMode(false);
                setEditData({});
                setError('');
            } else {
                console.error('Admin Document ID is not set');
            }
        } else {
            console.error('No user is currently logged in.');
        }
    };

    const handleDeleteArea = async (area) => {
        if (window.confirm(`Are you sure you want to delete the area: ${area}?`)) {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                const adminDocId = user.uid;
                const adminDocRef = doc(db, 'admins', adminDocId);

                try {
                    console.log('Updating Firestore document');
                    await updateDoc(adminDocRef, {
                        areas: areas.filter(a => a !== area),
                        [`approvers.${area}`]: []
                    });

                    console.log('Removing from local state');
                    setAreas(prevAreas => prevAreas.filter(a => a !== area));
                    setApprovers(prevApprovers => {
                        const { [area]: _, ...remainingApprovers } = prevApprovers;
                        return remainingApprovers;
                    });
                    setError('');
                } catch (error) {
                    console.error('Error deleting area:', error);
                }
            } else {
                console.error('No user is currently logged in.');
            }
        }
    };

    return (
        <div className="admin-portal-container">
            <form className="admin-portal-form">
            <div className="admin-portal-section">
                <div className="admin-portal-header">Manage Areas</div>
                <div className="admin-portal-section">
                    <label htmlFor="newArea">New Area:</label>
                    <input
                        id="newArea"
                        type="text"
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                        placeholder="Enter new area"
                    />
                    <button
                        type="button"
                        className="admin-portal-button"
                        onClick={handleAddArea}
                    >
                        Add Area
                    </button>
                </div>

                {areas.map((area) => (
                    <div key={area} className="area-container">
                        <div className="area-name">{area}</div>
                        <button
                            type="button"
                            className="admin-portal-button"
                            onClick={() => handleEdit(area)}
                        >
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                            type="button"
                            className="admin-portal-button"
                            onClick={() => handleDeleteArea(area)}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                    </div>
                ))}
            </div>
                <div className="admin-portal-header">Add Approver</div>

                {error && <div className="error-message">{error}</div>}

                <div className="admin-portal-section">
                    <label htmlFor="approverArea">Select Area/Section/Department:</label>
                    <select
                        id="approverArea"
                        value={newApprover.area}
                        onChange={(e) => setNewApprover({ ...newApprover, area: e.target.value })}
                    >
                        <option value="">--Select Area--</option>
                        {areas.map(area => (
                            <option key={area} value={area}>{area}</option>
                        ))}
                    </select>
                </div>

                <div className="admin-portal-section">
                    <label htmlFor="approverName">Approver Name:</label>
                    <input
                        id="approverName"
                        type="text"
                        value={newApprover.name}
                        onChange={(e) => setNewApprover({ ...newApprover, name: e.target.value })}
                        placeholder="Enter approver name"
                    />
                </div>

                <div className="admin-portal-section">
                    <label htmlFor="approverEmail">Approver Email:</label>
                    <input
                        id="approverEmail"
                        type="email"
                        value={newApprover.email}
                        onChange={(e) => setNewApprover({ ...newApprover, email: e.target.value })}
                        placeholder="Enter approver email"
                    />
                </div>

                <div className="admin-portal-section">
                    <label htmlFor="approverPassword">Password:</label>
                    <input
                        id="approverPassword"
                        type="password"
                        value={newApprover.password}
                        onChange={(e) => setNewApprover({ ...newApprover, password: e.target.value })}
                        placeholder="Enter approver password"
                    />
                </div>

                <div className="admin-portal-section">
                    <label htmlFor="approverDepartment">Department:</label>
                    <input
                        id="approverDepartment"
                        type="text"
                        value={newApprover.department}
                        onChange={(e) => setNewApprover({ ...newApprover, department: e.target.value })}
                        placeholder="Enter department"
                    />
                </div>

                <div className="admin-portal-section">
                    <label htmlFor="approverDesignation">Designation:</label>
                    <input
                        id="approverDesignation"
                        type="text"
                        value={newApprover.designation}
                        onChange={(e) => setNewApprover({ ...newApprover, designation: e.target.value })}
                        placeholder="Enter designation"
                    />
                </div>

                <div className="admin-portal-section">
                    <label htmlFor="approverEmployeeId">Employee ID:</label>
                    <input
                        id="approverEmployeeId"
                        type="text"
                        value={newApprover.employeeId}
                        onChange={(e) => setNewApprover({ ...newApprover, employeeId: e.target.value })}
                        placeholder="Enter employee ID"
                    />
                </div>

                <button
                    type="button"
                    className="admin-portal-button"
                    onClick={handleAddApprover}
                >
                    Add Approver
                </button>
            </form>


            {editMode && (
                <Modal>
                    <h3>Edit Area</h3>
                    <input
                        type="text"
                        value={editData.newName}
                        onChange={(e) => setEditData({ ...editData, newName: e.target.value })}
                    />
                    <button
                        type="button"
                        onClick={handleSaveEdit}
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={() => setEditMode(false)}
                    >
                        Cancel
                    </button>
                </Modal>
            )}
        </div>
    );
};

export default AdminPortal;

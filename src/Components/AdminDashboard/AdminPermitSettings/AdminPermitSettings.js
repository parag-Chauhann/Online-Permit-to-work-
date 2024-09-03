import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, setDoc, onSnapshot, query, where, deleteDoc, getDocs } from 'firebase/firestore';
import { db, auth } from '../../../Firebase';
import './AdminPermitSettings.css';

// Function to generate a unique 4-character code
const generateUniqueCode = () => {
    return Math.random().toString(36).substr(2, 4).toUpperCase(); // Generates a unique 4-character code
};

const AdminPermitSettings = () => {
    const [companyName, setCompanyName] = useState('');
    const [prefix, setPrefix] = useState('');
    const [autoGeneratePrefix, setAutoGeneratePrefix] = useState(true);
    const [adminUserID, setAdminUserID] = useState('');
    const [examplePermitNumber, setExamplePermitNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [permitNumbers, setPermitNumbers] = useState([]);
    const [editingPermit, setEditingPermit] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [permitFormat, setPermitFormat] = useState('');

    useEffect(() => {
        const fetchAndListenToPermitNumbers = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    // Fetch and listen to admin data
                    const adminDocRef = doc(db, 'Users', user.uid);
                    const adminSnapshot = await getDoc(adminDocRef);
                    if (adminSnapshot.exists()) {
                        const adminData = adminSnapshot.data();
                        setAdminUserID(user.uid);
                        setCompanyName(adminData.company || '');
                        setPrefix(adminData.prefix || '');
                        setAutoGeneratePrefix(!adminData.prefix);
                    }
    
                    // Listen for changes to the permit settings
                    const settingsDocRef = doc(db, 'PermitSettings', user.uid);
                    const settingsSnapshot = await getDoc(settingsDocRef);
                    if (settingsSnapshot.exists()) {
                        const settingsData = settingsSnapshot.data();
                        setPermitFormat(settingsData.permitFormat || '');
                    }
    
                    // Fetch and listen to permit numbers from PermitSettings collection
                    const permitsCollectionRef = collection(db, 'permits');
                    const permitsQuery = query(permitsCollectionRef, where("adminUserId", "==", user.uid));
                    const unsubscribe = onSnapshot(permitsQuery, (snapshot) => {
                        const permitsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        console.log('Fetched permits:', permitsList); // Debug log
                        setPermitNumbers(permitsList);
                    });
    
                    return () => unsubscribe(); // Cleanup on unmount
                } catch (error) {
                    console.error('Error fetching or listening to data: ', error);
                    setError('Error fetching or listening to data: ' + error.message);
                }
            }
        };
        fetchAndListenToPermitNumbers();
    }, []);

    const handleSaveSettings = async () => {
        setLoading(true);
        setError('');
        try {
            const user = auth.currentUser;
            if (user && adminUserID) {
                const uniqueCode = generateUniqueCode();
                const companyInitials = companyName.split(' ').map(word => word[0]).join('');
                const newPermitFormat = `${companyInitials}/${uniqueCode}/${autoGeneratePrefix ? '' : prefix}`;
    
                // Check if permit number already exists
                const permitsCollectionRef = collection(db, 'permits');
                const permitsQuery = query(permitsCollectionRef, where("adminUserId", "==", user.uid));
                const permitsSnapshot = await getDocs(permitsQuery);
                if (permitsSnapshot.docs.length > 0) {
                    setError('A permit number already exists. Cannot create more.');
                    setLoading(false);
                    return;
                }
    
                // Save the permit format
                await setDoc(doc(db, 'PermitSettings', adminUserID), {
                    permitFormat: newPermitFormat
                }, { merge: true });
    
                // Create a new permit number
                const permitDetails = {
                    ptwNumber: newPermitFormat,
                    adminUserId: user.uid,
                    createdAt: new Date(),
                };
    
                // Use the uniqueCode as the document ID
                await setDoc(doc(db, 'permits', uniqueCode), permitDetails);
    
                console.log('Settings and permit number saved successfully.');
            }
        } catch (error) {
            console.error('Error saving settings: ', error);
            setError('Error saving settings: ' + error.message);
        }
        setLoading(false);
    };
    
    const updateExamplePermitNumber = (prefix) => {
        if (!companyName) {
            setExamplePermitNumber('Click refresh button');
            return;
        }

        const companyInitials = companyName.split(' ').map(word => word[0]).join('');
        const uniqueCode = generateUniqueCode();
        const exampleNumber = `${companyInitials}/${uniqueCode}/${autoGeneratePrefix ? '' : prefix}`;

        setExamplePermitNumber(exampleNumber);
    };

    const handleEditPermit = (id, currentValue) => {
        setEditingPermit(id);
        setEditValue(currentValue);
    };

    const handleSaveEdit = async () => {
        if (window.confirm('Are you sure you want to save these changes?')) {
            try {
                const user = auth.currentUser;
                if (user) {
                    const permitSettingsDocRef = doc(db, 'PermitSettings', user.uid); // Path to the specific admin's settings document
    
                    // Update the permitFormat field in the document
                    await setDoc(permitSettingsDocRef, {
                        permitFormat: editValue // Assuming editValue contains the new permit format
                    }, { merge: true });
    
                    // Reset editing state
                    setEditingPermit(null);
                    setEditValue('');
                    console.log('Permit format updated successfully.');
                }
            } catch (error) {
                console.error('Error updating permit format:', error);
                setError('Error updating permit format: ' + error.message);
            }
        }
    };
    
    const handleDeletePermit = async (id) => {
        if (window.confirm('Are you sure you want to delete this permit?')) {
            try {
                const user = auth.currentUser;
                if (user) {
                    const permitSettingsDocRef = doc(db, 'PermitSettings', user.uid); // Path to the specific admin's settings document
    
                    // Fetch current data to preserve other fields
                    const docSnapshot = await getDoc(permitSettingsDocRef);
                    if (docSnapshot.exists()) {
                        const data = docSnapshot.data();
                        let permitFormat = data.permitFormat || ''; // Assuming permitFormat is a string
                        
                        // Perform your custom logic to remove the permit number
                        // Here, you might need to parse or manipulate the string accordingly
                        // Example: If permitFormat is like 'TTPL/U5WZ/PTW-06,PTW-07', you might split by commas
                        // and filter out the specific permit number you want to delete
                        
                        // Here’s an example if permitFormat is a comma-separated string
                        const permitNumbers = permitFormat.split(','); // Split into an array
                        const updatedPermitNumbers = permitNumbers.filter(p => p !== id); // Filter out the permit number
                        const updatedPermitFormat = updatedPermitNumbers.join(','); // Join back into a string
                        
                        // Update the document with the filtered permit numbers
                        await setDoc(permitSettingsDocRef, {
                            permitFormat: updatedPermitFormat
                        }, { merge: true });
                        
                        console.log('Permit number deleted successfully.');
                    } else {
                        console.error('No permit settings document found.');
                    }
                }
            } catch (error) {
                console.error('Error deleting permit:', error);
                setError('Error deleting permit: ' + error.message);
            }
        }
    };
    
    
    
    useEffect(() => {
        updateExamplePermitNumber(prefix);
    }, [prefix, companyName, autoGeneratePrefix]);

    return (
        <div className="admin-permit-settings">
            <h2 className="admin-permit-settings__heading">Define Permit Number Format</h2>
            <div className="admin-permit-settings__form-group">
                <label htmlFor="companyName" className="admin-permit-settings__label">Company Name:</label>
                <input
                    type="text"
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter company name (e.g., TSM TheSafetyMaster Private Limited)"
                    className="admin-permit-settings__input"
                />
            </div>
            <div className="admin-permit-settings__form-group">
                <label htmlFor="prefix" className="admin-permit-settings__label">Permit Number Prefix:</label>
                <input
                    type="text"
                    id="prefix"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="Enter prefix (e.g., PTW)"
                    disabled={autoGeneratePrefix}
                    className="admin-permit-settings__input"
                />
            </div>
            <div className="admin-permit-settings__form-group">
                <label htmlFor="autoGeneratePrefix" className="admin-permit-settings__label">Auto-Generate Prefix:</label>
                <input
                    type="checkbox"
                    id="autoGeneratePrefix"
                    checked={autoGeneratePrefix}
                    onChange={(e) => {
                        setAutoGeneratePrefix(e.target.checked);
                        if (e.target.checked) setPrefix(''); // Clear prefix if auto-generate is enabled
                        updateExamplePermitNumber(e.target.checked ? '' : prefix);
                    }}
                    className="admin-permit-settings__checkbox"
                />
            </div>
            <div className="admin-permit-settings__form-group">
                <label className="admin-permit-settings__label">Example Permit Number:</label>
                <div className="admin-permit-settings__example-container">
                    <p className="admin-permit-settings__example">{examplePermitNumber}</p>
                    <button
                        className="admin-permit-settings__refresh-button"
                        onClick={() => updateExamplePermitNumber(prefix)}
                        title="Refresh to see the latest example permit number"
                    >
                        🔄
                    </button>
                </div>
            </div>
            <button onClick={handleSaveSettings} className="admin-permit-settings__save-button" disabled={loading}>
                Save Settings
            </button>
            {error && <p className="error">{error}</p>}
            {loading && <p>Loading...</p>}
            
            <div className="permit-numbers-table">
                <h2>Generated Permit Numbers</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Permit Number</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {permitNumbers.length > 0 ? permitNumbers.map(p => (
                            <tr key={p.id}>
                                <td>
                                    {editingPermit === p.id ? (
                                        <input
                                            type="text"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                        />
                                    ) : (
                                        p.ptwNumber || 'No Format'
                                    )}
                                </td>
                                <td>
                                    {editingPermit === p.id ? (
                                        <>
                                            <button onClick={handleSaveEdit}>Save</button>
                                            <button onClick={() => setEditingPermit(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEditPermit(p.id, p.ptwNumber)}>Edit</button>
                                            <button onClick={() => handleDeletePermit(p.id)}>Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="2">No permit numbers available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPermitSettings;

import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../Firebase';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import './SafetyDepartmentManagement.css';

const SafetyDepartmentManagement = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [designation, setDesignation] = useState('');
    const [password, setPassword] = useState(''); // Password field
    const [safetyDepartments, setSafetyDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const auth = getAuth(); // Initialize Firebase Authentication

    useEffect(() => {
        const fetchSafetyDepartments = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    throw new Error('User not authenticated');
                }

                const q = query(collection(db, 'SafetyDepartments'), where("adminId", "==", user.uid));
                const querySnapshot = await getDocs(q);
                const departmentsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setSafetyDepartments(departmentsList);
            } catch (error) {
                console.error("Error fetching safety departments: ", error);
                setError("Error fetching safety departments: " + error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSafetyDepartments();
    }, [auth]);

    const handleAddDepartment = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('User not authenticated');
            }

            // Create a new user in Firebase Authentication
            await createUserWithEmailAndPassword(auth, email, password);

            // Add the new safety department to Firestore
            await addDoc(collection(db, 'SafetyDepartments'), {
                email,
                name,
                designation,
                isAdmin: false,
                isApprover: false,
                isSafetyDepartment: true, // Set this field to true
                paymentStatus: true,
                adminId: user.uid // Set as per your requirements
            });

            // Refresh the safety department list
            const q = query(collection(db, 'SafetyDepartments'), where("adminId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const departmentsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSafetyDepartments(departmentsList);

            // Clear form fields
            setEmail('');
            setName('');
            setDesignation('');
            setPassword(''); // Clear password field
        } catch (error) {
            console.error("Error adding safety department: ", error);
            setError("Error adding safety department: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="safety-department-management">
            <h1>Safety Department Management</h1>
            <form onSubmit={handleAddDepartment}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Designation"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Add Safety Department</button>
                {error && <p className="error">{error}</p>}
            </form>
            <h2>Safety Departments List</h2>
            <table className="departments-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Designation</th>
                    </tr>
                </thead>
                <tbody>
                    {safetyDepartments.map(department => (
                        <tr key={department.id}>
                            <td>{department.name}</td>
                            <td>{department.email}</td>
                            <td>{department.designation}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SafetyDepartmentManagement;

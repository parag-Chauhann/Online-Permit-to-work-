import React, { useState, useEffect } from 'react';
import { collection, doc, deleteDoc, updateDoc, getDocs, query, where, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../../Firebase';
import { createUserWithEmailAndPassword, updateEmail, deleteUser, sendEmailVerification } from 'firebase/auth';
import './UserManagement.css';

const UserManagement = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [company, setCompany] = useState('');
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [adminPlan, setAdminPlan] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          // Fetch the current admin data to get the selectedPlan
          const adminDoc = await getDoc(doc(db, 'Users', user.uid));
          if (adminDoc.exists()) {
            const adminData = adminDoc.data();
            setAdminPlan(adminData.selectedPlan);

            // Listen for changes in the admin's selectedPlan
            onSnapshot(doc(db, 'Users', user.uid), (doc) => {
              if (doc.exists()) {
                const data = doc.data();
                setAdminPlan(data.selectedPlan);
                updateUserPlans(user.uid, data.selectedPlan);
              }
            });
          }

          const q = query(collection(db, 'Users'), where('createdBy', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const usersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setUsers(usersList);
        } catch (error) {
          console.error('Error fetching users: ', error);
          setError('Error fetching users: ' + error.message);
        }
      }
    };
    fetchUsers();
  }, [editMode]);

  const updateUserPlans = async (adminUid, newPlan) => {
    try {
      const q = query(collection(db, 'Users'), where('createdBy', '==', adminUid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, {
          selectedPlan: newPlan,
        });
      });
      console.log('Users updated with new plan:', newPlan);
    } catch (error) {
      console.error('Error updating user plans: ', error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault(); // Prevents default form behavior
    setLoading(true);
    setError('');
  
    const user = auth.currentUser;
    if (user) {
      try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;
  
        // Add user to Firestore
        await setDoc(doc(db, 'Users', newUser.uid), {
          email,
          firstName,
          lastName,
          department,
          designation,
          employeeId,
          company,
          createdBy: user.uid,
          isAdmin: false,
          uid: newUser.uid,
          paymentStatus: true,
          selectedPlan: adminPlan
        });
  
        // Refresh the users list
        const q = query(collection(db, 'Users'), where('createdBy', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const usersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
  
        console.log('User added successfully.');
        resetForm();
      } catch (error) {
        console.error('Error adding user: ', error);
        setError('Error adding user: ' + error.message);
      }
    }
  
    setLoading(false);
  };
  

  const handleEditUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const currentUser = auth.currentUser;
    if (currentUser && userId) {
      try {
        // Get the user from Firestore
        const userRef = doc(db, 'Users', userId);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        if (userData) {
          // Check if the current email is verified
          if (currentUser.emailVerified) {
            if (email !== currentUser.email) {
              // Update email in Firebase Authentication
              await updateEmail(currentUser, email);
            }
          } else {
            // Send email verification if current email is not verified
            await sendEmailVerification(currentUser);
            throw new Error('Please verify your current email before changing it.');
          }

          // Update user in Firestore
          await updateDoc(doc(db, 'Users', userId), {
            email,
            firstName,
            lastName,
            department,
            designation,
            employeeId,
            company,
          });

          // Refresh the users list
          const q = query(collection(db, 'Users'), where('createdBy', '==', currentUser.uid));
          const querySnapshot = await getDocs(q);
          const usersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setUsers(usersList);

          setEditMode(false);
          resetForm();
        }
      } catch (error) {
        console.error('Error updating user: ', error);
        setError('Error updating user: ' + error.message);
      }
    }

    setLoading(false);
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const currentUser = auth.currentUser;
    if (currentUser && userId) {
      try {
        // Get the user from Firestore
        const userRef = doc(db, 'Users', userId);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        if (userData) {
          // Delete user from Firebase Authentication
          const authUser = await auth.currentUser;
          if (authUser) {
            await deleteUser(authUser);
          }
        }

        // Delete user from Firestore
        await deleteDoc(userRef);

        // Refresh the users list
        const q = query(collection(db, 'Users'), where('createdBy', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const usersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);

        resetForm();
      } catch (error) {
        console.error('Error deleting user: ', error);
        setError('Error deleting user: ' + error.message);
      }
    }

    setLoading(false);
  };

  const resetForm = () => {
    setEmail('');
    setFirstName('');
    setLastName('');
    setPassword('');
    setDepartment('');
    setDesignation('');
    setEmployeeId('');
    setUserId('');
    setEditMode(false);
    setCompany('');
  };

  const filteredUsers = users.filter((user) =>
    (user.firstName?.toLowerCase().includes(search.toLowerCase()) || '') ||
    (user.lastName?.toLowerCase().includes(search.toLowerCase()) || '') ||
    (user.department?.toLowerCase().includes(search.toLowerCase()) || '') ||
    (user.designation?.toLowerCase().includes(search.toLowerCase()) || '')
  );
  

  return (
    <div className="user-management">
      <h1>User Management</h1>
      <form onSubmit={editMode ? handleEditUser : handleAddUser}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
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
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
        {!editMode && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}
        <button type="submit">{editMode ? 'Update User' : 'Add User'}</button>
        {editMode && <button type="button" onClick={() => setEditMode(false)}>Cancel Edit</button>}
        {editMode && <button type="button" onClick={handleDeleteUser} disabled={!userId}>Delete User</button>}
        {error && <p className="error">{error}</p>}
        {loading && <p>Loading...</p>}
      </form>
      <input
        type="text"
        placeholder="Search by name, department, or designation"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="user-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Employee ID</th>
            <th>Company</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.department}</td>
              <td>{user.designation}</td>
              <td>{user.employeeId}</td>
              <td>{user.company}</td>
              <td>
                <button onClick={() => {
                  setEmail(user.email);
                  setFirstName(user.firstName);
                  setLastName(user.lastName);
                  setDepartment(user.department);
                  setDesignation(user.designation);
                  setEmployeeId(user.employeeId);
                  setUserId(user.id);
                  setEditMode(true);
                }}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;

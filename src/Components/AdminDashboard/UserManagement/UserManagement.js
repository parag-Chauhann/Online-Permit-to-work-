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
    e.preventDefault(); // Prevent default form behavior
    setLoading(true);
    setError('');
  
    // Password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.message);
      setLoading(false);
      return;
    }
  
    const currentAdmin = auth.currentUser;
    if (currentAdmin) {
      try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;
  
        // Send verification email
        await sendEmailVerification(newUser);
  
        // Add user to Firestore
        await setDoc(doc(db, 'Users', newUser.uid), {
          email,
          firstName,
          lastName,
          department,
          designation,
          employeeId,
          company,
          createdBy: currentAdmin.uid,
          isAdmin: false,
          uid: newUser.uid,
          paymentStatus: true,
          selectedPlan: adminPlan
        });
  
        // Refresh the users list
        const q = query(collection(db, 'Users'), where('createdBy', '==', currentAdmin.uid));
        const querySnapshot = await getDocs(q);
        const usersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
  
        console.log('User added and verification email sent successfully.');
        resetForm();
      } catch (error) {
        console.error('Error adding user: ', error);
        setError('Error adding user: ' + error.message);
      }
    }
  
    setLoading(false);
  };
  
  // Password validation function
  const validatePassword = (password) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
  
    if (password.length < minLength) {
      return { valid: false, message: 'Password must be at least 6 characters long.' };
    }
    if (!hasUpperCase) {
      return { valid: false, message: 'Password must contain at least one uppercase letter.' };
    }
    if (!hasLowerCase) {
      return { valid: false, message: 'Password must contain at least one lowercase letter.' };
    }
    if (!hasNumber) {
      return { valid: false, message: 'Password must contain at least one number.' };
    }
  
    return { valid: true, message: '' };
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
      <form onSubmit={editMode ? handleEditUser : handleAddUser} className='add-user-form'>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className='user-input'
        />
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className='user-input'
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className='user-input'
        />
        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
          className='user-input'
        />
        <input
          type="text"
          placeholder="Designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          required
          className='user-input'
        />
        <input
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
          className='user-input'
        />
        <input
          type="text"
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          className='user-input'
        />
        {!editMode && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='user-input'
          />
        )}
        <button type="submit" className="add-user-button">
          <span className="add-user-text">{editMode ? 'Update User' : 'Add User'}</span>
          <span className="add-user-svg">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="20"
            viewBox="0 0 38 15"
            fill="none"
            >
              <path
              fill="white"
              d="M10 7.519l-.939-.344h0l.939.344zm14.386-1.205l-.981-.192.981.192zm1.276 5.509l.537.843.148-.094.107-.139-.792-.611zm4.819-4.304l-.385-.923h0l.385.923zm7.227.707a1 1 0 0 0 0-1.414L31.343.448a1 1 0 0 0-1.414 0 1 1 0 0 0 0 1.414l5.657 5.657-5.657 5.657a1 1 0 0 0 1.414 1.414l6.364-6.364zM1 7.519l.554.833.029-.019.094-.061.361-.23 1.277-.77c1.054-.609 2.397-1.32 3.629-1.787.617-.234 1.17-.392 1.623-.455.477-.066.707-.008.788.034.025.013.031.021.039.034a.56.56 0 0 1 .058.235c.029.327-.047.906-.39 1.842l1.878.689c.383-1.044.571-1.949.505-2.705-.072-.815-.45-1.493-1.16-1.865-.627-.329-1.358-.332-1.993-.244-.659.092-1.367.305-2.056.566-1.381.523-2.833 1.297-3.921 1.925l-1.341.808-.385.245-.104.068-.028.018c-.011.007-.011.007.543.84zm8.061-.344c-.198.54-.328 1.038-.36 1.484-.032.441.024.94.325 1.364.319.45.786.64 1.21.697.403.054.824-.001 1.21-.09.775-.179 1.694-.566 2.633-1.014l3.023-1.554c2.115-1.122 4.107-2.168 5.476-2.524.329-.086.573-.117.742-.115s.195.038.161.014c-.15-.105.085-.139-.076.685l1.963.384c.192-.98.152-2.083-.74-2.707-.405-.283-.868-.37-1.28-.376s-.849.069-1.274.179c-1.65.43-3.888 1.621-5.909 2.693l-2.948 1.517c-.92.439-1.673.743-2.221.87-.276.064-.429.065-.492.057-.043-.006.066.003.155.127.07.099.024.131.038-.063.014-.187.078-.49.243-.94l-1.878-.689zm14.343-1.053c-.361 1.844-.474 3.185-.413 4.161.059.95.294 1.72.811 2.215.567.544 1.242.546 1.664.459a2.34 2.34 0 0 0 .502-.167l.15-.076.049-.028.018-.011c.013-.008.013-.008-.524-.852l-.536-.844.019-.012c-.038.018-.064.027-.084.032-.037.008.053-.013.125.056.021.02-.151-.135-.198-.895-.046-.734.034-1.887.38-3.652l-1.963-.384zm2.257 5.701l.791.611.024-.031.08-.101.311-.377 1.093-1.213c.922-.954 2.005-1.894 2.904-2.27l-.771-1.846c-1.31.547-2.637 1.758-3.572 2.725l-1.184 1.314-.341.414-.093.117-.025.032c-.01.013-.01.013.781.624zm5.204-3.381c.989-.413 1.791-.42 2.697-.307.871.108 2.083.385 3.437.385v-2c-1.197 0-2.041-.226-3.19-.369-1.114-.139-2.297-.146-3.715.447l.771 1.846z"
              ></path>
              </svg>
              </span>
        </button>

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
      <div className='user-table-containe'>
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
    </div>
  );
};

export default UserManagement;
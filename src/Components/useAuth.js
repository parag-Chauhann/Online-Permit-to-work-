import { useState, useEffect, useContext, createContext } from 'react';
import { auth, db } from '../Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'Users', user.uid); // Use the UID as the document ID
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setCurrentUser({ uid: user.uid, ...userDoc.data() });
            setError('');
          } else {
            setError('User document not found in Firestore.');
            setCurrentUser(null);
          }
        } catch (error) {
          setError('Error fetching user data: ' + error.message);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

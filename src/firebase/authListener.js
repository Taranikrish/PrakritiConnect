import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { setUser, clearAuth } from '../slices/authSlice';
import store from '../store';

// Firebase authentication state listener
export const setupAuthListener = () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // Convert Firestore Timestamps to serializable format
          const serializableUserData = { ...userData };
          if (userData.createdAt) {
            serializableUserData.createdAt = userData.createdAt.toDate().toISOString();
          }
          
          // Dispatch to Redux store
          store.dispatch(setUser({
            user: {
              uid: user.uid,
              email: user.email,
              ...serializableUserData
            },
            role: userData.role
          }));
        } else {
          // User document doesn't exist, clear auth
          store.dispatch(clearAuth());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        store.dispatch(clearAuth());
      }
    } else {
      // No user signed in
      store.dispatch(clearAuth());
    }
  });
};

// Helper function to get current user from Redux store
export const getCurrentUser = () => {
  const state = store.getState();
  return state.auth.user;
};

// Helper function to get user role
export const getUserRole = () => {
  const state = store.getState();
  return state.auth.role;
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  const state = store.getState();
  return state.auth.isAuthenticated;
};

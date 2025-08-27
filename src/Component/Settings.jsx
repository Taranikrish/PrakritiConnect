import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { logout } from '../slices/authSlice';
import { auth, db } from '../firebase';
import { signOut, deleteUser, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Error signing out. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm("Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.");
    
    if (confirmDelete) {
      try {
        const currentUser = auth.currentUser;
        
        if (currentUser) {
          // Try to delete Firestore documents first
          try {
            await deleteDoc(doc(db, 'users', currentUser.uid));
            console.log("User document deleted successfully");
          } catch (firestoreError) {
            console.log("User document deletion issue:", firestoreError);
            // Continue with auth deletion even if Firestore fails
          }
          
          // If user is an organizer, delete organizer data too
          if (user?.role === 'organizer') {
            try {
              await deleteDoc(doc(db, 'organizers', currentUser.uid));
              console.log("Organizer document deleted successfully");
            } catch (organizerError) {
              console.log("Organizer document deletion issue:", organizerError);
            }
          }
          
          try {
            // Prompt user for password for reauthentication
            const password = prompt("Please enter your password to confirm account deletion:");
            
            if (!password) {
              alert("Account deletion cancelled. Password is required for security confirmation.");
              return;
            }
            
            // Reauthenticate the user before deletion
            const credential = await signInWithEmailAndPassword(auth, user.email, password);
            await deleteUser(credential.user);
            console.log("Auth user deleted successfully");
            
            // Dispatch logout to clear Redux state
            dispatch(logout());
            navigate("/");
            alert("Your account has been successfully deleted.");
          } catch (authError) {
            console.error("Auth deletion error:", authError);
            
            if (authError.code === 'auth/wrong-password') {
              alert("Incorrect password. Please try again.");
            } else if (authError.code === 'auth/requires-recent-login') {
              alert("For security reasons, please log out and log back in before deleting your account. Your Firestore data has been removed, but you'll need to log in again to complete account deletion.");
              
              // Log out since we can't complete the deletion
              await signOut(auth);
              dispatch(logout());
              navigate("/");
            } else {
              alert("Error deleting account: " + (authError.message || "Please try again or contact support."));
            }
          }
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        
        if (error.code === 'auth/requires-recent-login') {
          alert("Security requirement: Please log out and log back in to confirm your identity before account deletion.");
        } else if (error.code === 'auth/network-request-failed') {
          alert("Network error. Please check your internet connection and try again.");
        } else {
          alert("Error deleting account: " + (error.message || "Please try again or contact support."));
        }
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#0e1b17] mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#0e1b17] mb-4">Account Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {user?.fullName || "N/A"}</p>
            <p><span className="font-medium">Email:</span> {user?.email || "N/A"}</p>
            <p><span className="font-medium">Role:</span> {user?.role || "N/A"}</p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-[#0e1b17] mb-4">Account Actions</h2>
          
          <div className="space-y-4">
            <button
              onClick={handleLogout}
              className="w-full bg-[#14b881] text-white py-2 px-4 rounded-lg hover:bg-[#0fa971] transition-colors"
            >
              Logout
            </button>
            
            <button
              onClick={handleDeleteAccount}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>

        <div className="border-t pt-6 mt-6">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> Logout will end your current session but keep your account. 
            Delete Account will permanently remove your account and all associated data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;

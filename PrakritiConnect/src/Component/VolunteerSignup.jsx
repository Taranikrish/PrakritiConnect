import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { login } from '../slices/authSlice';

const VolunteerSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    interests: {
      treePlanting: false,
      beachCleanup: false,
      wildlifeConservation: false,
      sustainableWorkshops: false,
      environmentalAdvocacy: false
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setFormData(prev => ({
        ...prev,
        interests: {
          ...prev.interests,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Store in Firestore with role = "volunteer"
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: formData.fullName,
        email: formData.email,
        role: "volunteer",
        interests: Object.keys(formData.interests).filter(key => formData.interests[key]),
        createdAt: new Date(), // This will be converted to Firestore Timestamp automatically
      });

      // ✅ Dispatch login action to Redux
      dispatch(login({
        user: {
          uid: user.uid,
          email: user.email,
          fullName: formData.fullName,
          interests: Object.keys(formData.interests).filter(key => formData.interests[key]),
          role: "volunteer"
        },
        role: "volunteer"
      }));

      alert("Volunteer signup successful!");
      
      // ✅ Navigate to volunteer dashboard
      navigate("/home");
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        password: "",
        interests: {
          treePlanting: false,
          beachCleanup: false,
          wildlifeConservation: false,
          sustainableWorkshops: false,
          environmentalAdvocacy: false
        }
      });
    } catch (error) {
      console.error("Error signing up:", error);
      alert(error.message);
      if (error.code === "auth/email-already-in-use") {
        alert("Email already registered");
      }
    }
  };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#f8fcfa] overflow-x-hidden"
      style={{
        fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif',
      }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7f3ef] px-10 py-3">
          <div className="flex items-center gap-4 text-[#0e1b17]">
            <div className="size-4">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h2 className="text-[#0e1b17] text-lg font-bold leading-tight tracking-[-0.015em]">
              PrakritiConnect
            </h2>
          </div>
        </header>
        <form
          onSubmit={handleSubmit}
          className="px-40 flex flex-1 justify-center py-5"
        >
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5">
            <div className="@container">
              <div className="@[480px]:px-4 @[480px]:py-3">
                <div
                  className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-[#f8fcfa] @[480px]:rounded-lg min-h-[218px]"
                  style={{
                    backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDLcjsZakDmusBAM_Sl8pKLyNdqexU6OYb6Y9vFK4DMECo_TE5Zt50LzjHsfvDx6lXqKFd2LTSQodrwUSZ2cNL2PGEHt4akGPCcgmoY0hG-tCupdKCKp1-ilcQ4fugENdUjDHFFO213inJh3l-YIMx-gb1BYOgy1ZHquQPKa9voflSTi5EiuMWtv0Bl1RiYgl6HNNEjD38oUkFc6uttFN-j47pYaEit-Tt8gzKhh8-O4xM2oXqHT2AxN3oL9iHYWlxpDhAMV31WeTw2')"
                  }}
                ></div>
              </div>
            </div>
            <h2 className="text-[#0e1b17] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
              Sign up as Volunteer
            </h2>

            {/* Authentication Fields */}
            {["fullName", "email", "password"].map((field) => (
              <div
                key={field}
                className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3"
              >
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#0e1b17] text-base font-medium leading-normal pb-2">
                    {field === "fullName" ? "Full Name" : field === "email" ? "Email" : "Password"}
                  </p>
                  <input
                    type={field === "password" ? "password" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={`Enter your ${field === "fullName" ? "full name" : field === "email" ? "email" : "password"}`}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0e1b17] focus:outline-0 focus:ring-0 border border-[#d0e7df] bg-[#f8fcfa] focus:border-[#d0e7df] h-14 placeholder:text-[#4e977f] p-[15px] text-base font-normal leading-normal"
                    required
                  />
                </label>
              </div>
            ))}

            {/* Interests Section */}
            <h3 className="text-[#0e1b17] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Interests
            </h3>
            <div className="px-4">
              {[
                { name: "treePlanting", label: "Tree Planting" },
                { name: "beachCleanup", label: "Beach Cleanup" },
                { name: "wildlifeConservation", label: "Wildlife Conservation" },
                { name: "sustainableWorkshops", label: "Sustainable Living Workshops" },
                { name: "environmentalAdvocacy", label: "Environmental Advocacy" }
              ].map((interest) => (
                <label key={interest.name} className="flex gap-x-3 py-3 flex-row">
                  <input
                    type="checkbox"
                    name={interest.name}
                    checked={formData.interests[interest.name]}
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-[#d0e7df] border-2 bg-transparent text-[#14b881] checked:bg-[#14b881] checked:border-[#14b881] checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-[#d0e7df] focus:outline-none"
                  />
                  <p className="text-[#0e1b17] text-base font-normal leading-normal">
                    {interest.label}
                  </p>
                </label>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex px-4 py-3">
              <button
                type="submit"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 flex-1 bg-[#14b881] text-[#0e1b17] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Sign Up</span>
              </button>
            </div>

            <p onClick={(e)=>{
              e.preventDefault();
              handleNavigation("/login");
            }}
          className="text-[#4e977f] text-sm text-center underline py-3 inline-block hover:cursor-pointer  hover:text-[#0e6f4f] ">
            Already have an account? Log in
          </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VolunteerSignup;

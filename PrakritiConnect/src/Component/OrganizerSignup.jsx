import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useDispatch } from 'react-redux';
import { login } from '../slices/authSlice';
import { useNavigate } from "react-router-dom";
import { validateOrganizerForm, validateField } from "../utils/validation";



const OrganizerSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "organizer",
    password: "",
    orgName: "",
    phone: "",
    orgType: "",
    location: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const validation = validateField(name, value);
    if (!validation.isValid) {
      setErrors(prev => ({ ...prev, [name]: validation.message }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const validation = validateOrganizerForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      // ✅ Create Firebase Auth User
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // ✅ Store extra organizer data in Firestore
      await setDoc(doc(db, "organizers", user.uid), {
        uid: user.uid,
        fullName: formData.fullName,
        email: formData.email,
        orgName: formData.orgName,
        phone: formData.phone,
        orgType: formData.orgType,
        location: formData.location,
        description: formData.description,
        role: "organizer",
        createdAt: new Date(),
      });

      // ✅ Also store in users collection for auth listener
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: formData.fullName,
        email: formData.email,
        role: "organizer",
        createdAt: new Date(),
      });

      // Dispatch login action to Redux
      dispatch(login({
        user: {
          uid: user.uid,
          email: user.email,
          fullName: formData.fullName,
          orgName: formData.orgName,
          role: "organizer"
        },
        role: "organizer"
      }));
      
      alert("Organizer registered successfully!");
      
      // ✅ Navigate to organizer dashboard with user ID
      navigate(`/organizer-dashboard/${user.uid}`);
      
      setFormData({
        fullName: "",
        email: "",
        password: "",
        orgName: "",
        phone: "",
        orgType: "",
        location: "",
        description: "",
      });
    } catch (error) {
      console.error("Error signing up:", error);
      alert(error.message);
      if(error.code=="auth/email-already-in-use"){
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
            <h2 className="text-[#0e1b17] text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
              Sign up as Organizer
            </h2>

            {/* Authentication Section */}
            <h3 className="text-[#0e1b17] text-lg font-bold px-4 pb-2 pt-4">
              Admin Detail
            </h3>
            {["fullName", "email"].map((field) => (
              <div
                key={field}
                className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3"
              >
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#0e1b17] text-base font-medium pb-2">
                    {field === "fullName"
                      ? "Full Name"
                      : "Email"}
                  </p>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={`Enter your ${field === "fullName" ? "full name" : "email"}`}
                    className={`form-input w-full rounded-lg bg-[#e7f3ef] h-14 p-4 text-base text-[#0e1b17] placeholder:text-[#4e977f] focus:outline-none ${
                      errors[field] ? 'border-2 border-red-500' : ''
                    }`}
                  />
                  {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
                </label>
              </div>
            ))}

            {/* Password Field with Toggle */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#0e1b17] text-base font-medium pb-2">
                  Password
                </p>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your password"
                    className={`form-input w-full rounded-lg bg-[#e7f3ef] h-14 p-4 text-base text-[#0e1b17] placeholder:text-[#4e977f] focus:outline-none pr-12 ${
                      errors.password ? 'border-2 border-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4e977f] hover:text-[#0e1b17] focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </label>
            </div>

            {/* Organizer Profile */}
            <h3 className="text-[#0e1b17] text-lg font-bold px-4 pb-2 pt-4">
              Organization Profile
            </h3>
            {[
              { name: "orgName", label: "Organization Name" },
              { name: "phone", label: "Phone Number/WhatsApp" },
              { name: "location", label: "Location/Address" },
            ].map((field) => (
              <div
                key={field.name}
                className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3"
              >
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#0e1b17] text-base font-medium pb-2">
                    {field.label}
                  </p>
                  <input
                    type="text"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                    className={`form-input w-full rounded-lg bg-[#e7f3ef] h-14 p-4 text-base text-[#0e1b17] placeholder:text-[#4e977f] focus:outline-none ${
                      errors[field.name] ? 'border-2 border-red-500' : ''
                    }`}
                  />
                  {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>}
                </label>
              </div>
            ))}

            {/* Organization Type */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#0e1b17] text-base font-medium pb-2">
                  Organization Type
                </p>
                <select
                  name="orgType"
                  value={formData.orgType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input w-full rounded-lg bg-[#e7f3ef] h-14 p-4 text-base text-[#0e1b17] focus:outline-none ${
                    errors.orgType ? 'border-2 border-red-500' : ''
                  }`}
                >
                  <option value="">Select organization type</option>
                  <option value="NGO">NGO</option>
                  <option value="College Club">College Club</option>
                  <option value="Corporate CSR">Corporate CSR</option>
                  <option value="Individual">Individual</option>
                </select>
              </label>
            </div>

            {/* Description */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#0e1b17] text-base font-medium pb-2">
                  Description/Mission
                </p>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your organization's mission"
                  className="form-input w-full rounded-lg bg-[#e7f3ef] min-h-36 p-4 text-base text-[#0e1b17] placeholder:text-[#4e977f] focus:outline-none"
                />
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex px-4 py-3 justify-center">
              <button
                type="submit"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#14b881] text-[#0e1b17] text-sm font-bold"
              >
                Sign Up
              </button>
            </div>

            <p onClick={(e)=>{
              e.preventDefault();
              navigate("/login");
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

export default OrganizerSignup;

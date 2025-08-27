import React, { useEffect } from "react";
import Header from "../Component/Header";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

const Auth = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const handleNavigation = (path) => {
    navigate(path);
  };
  
  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="relative flex min-h-screen flex-col bg-[#f8fcfa] font-['Plus Jakarta Sans','Noto Sans',sans-serif]">
      <Header />

      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="flex flex-col w-[512px] max-w-[960px] items-center gap-y-2 flex-1 py-5">
          <div
            className="w-1/2 bg-center bg-cover min-h-[218px] rounded-lg"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDLcjsZakDmusBAM_Sl8pKLyNdqexU6OYb6Y9vFK4DMECo_TE5Zt50LzjHsfvDx6lXqKFd2LTSQodrwUSZ2cNL2PGEHt4akGPCcgmoY0hG-tCupdKCKp1-ilcQ4fugENdUjDHFFO213inJh3l-YIMx-gb1BYOgy1ZHquQPKa9voflSTi5EiuMWtv0Bl1RiYgl6HNNEjD38oUkFc6uttFN-j47pYaEit-Tt8gzKhh8-O4xM2oXqHT2AxN3oL9iHYWlxpDhAMV31WeTw2')",
            }}
          ></div>

          <h2 className="text-[#0e1b17] text-[28px] font-bold text-center py-5">
            Join PraKritiConnect
          </h2>

          <div className="flex flex-col gap-3 max-w-[480px] w-full mx-auto">
            <button onClick={(e)=>{
              e.preventDefault();
              handleNavigation("/OrganizerSignUp");
            }}
            className="h-10 rounded-lg hover:bg-[#14b881] bg-[#e7f3ef]  text-[#0e1b17] text-sm font-bold transition-colors duration-500 cursor-pointer">
              Sign up as Organizer
            </button>
            <button onClick={(e)=>{
              e.preventDefault();
              handleNavigation("/VolunteerSignUp");
            }}
            className="h-10 rounded-lg hover:bg-[#14b881] bg-[#e7f3ef] text-[#0e1b17] text-sm font-bold transition-colors duration-500 cursor-pointer" >
              Sign up as Volunteer
            </button>
            
          </div>

          <div className="flex justify-center">
            <p onClick={(e)=>{
              e.preventDefault();
              handleNavigation("/login");
            }}
          className="text-[#4e977f] text-sm text-center underline py-3 inline-block hover:cursor-pointer  hover:text-[#0e6f4f] ">
            Already have an account? Log in
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

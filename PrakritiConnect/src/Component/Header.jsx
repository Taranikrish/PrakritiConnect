import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const { user } = useSelector((state) => state.auth);

  const handleDashboardNavigation = () => {
    if (role === 'organizer') {
      navigate(`/organizer-dashboard/${user?.uid}`);
    } else if (role === 'volunteer') {
      navigate('/volunteer-dashboard');
    } else {
      // Default to home if role is not set
      navigate('/home');
    }
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7f3ef] px-10 py-3">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 text-[#0e1b17] cursor-pointer" onClick={() => handleNavigation("/home")}>
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
              />
            </svg>
          </div>
          <h2 className="text-[#0e1b17] text-lg font-bold leading-tight tracking-[-0.015em]">
           PrakritiConnect
          </h2>
        </div>
        {isAuthenticated && (
          <div className="flex items-center gap-9">
            <button 
              className="text-[#0e1b17] text-sm font-medium hover:text-[#14b881] transition-colors"
              onClick={() => handleNavigation("/home")}
            >
              Home
            </button>
            <button 
              className="text-[#0e1b17] text-sm font-medium hover:text-[#14b881] transition-colors"
              onClick={() => handleNavigation("/events")}
            >
              Events
            </button>
            <button 
              className="text-[#0e1b17] text-sm font-medium hover:text-[#14b881] transition-colors"
              onClick={() => handleNavigation("/organizations")}
            >
              Organizations
            </button>
            <button 
              className="text-[#0e1b17] text-sm font-medium hover:text-[#14b881] transition-colors"
              onClick={() => handleNavigation("/about")}
            >
              About
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-1 justify-end gap-8">
        {!isAuthenticated ? (
          <div className="flex gap-2">
            <button 
              className="flex min-w-[84px] h-10 px-4 items-center justify-center rounded-lg bg-[#14b881] text-[#0e1b17] text-sm font-bold hover:bg-[#0fa36d] transition-colors"
              onClick={() => handleNavigation("/")}
            >
              Sign up
            </button>
            <button 
              className="flex min-w-[84px] h-10 px-4 items-center justify-center rounded-lg bg-[#e7f3ef] text-[#0e1b17] text-sm font-bold hover:bg-[#d0e7df] transition-colors"
              onClick={() => handleNavigation("/")}
            >
              Log in
            </button>
          </div>
        ) : (
          <>
        {/* Removed search input */}
            <button 
              className="flex h-10 px-4 items-center justify-center rounded-lg bg-[#e7f3ef] text-[#0e1b17] text-sm font-bold hover:bg-[#d0e7df] transition-colors"
              onClick={handleDashboardNavigation}
            >
              Dashboard
            </button>
            <div className="flex items-center justify-center bg-[#14b881] rounded-full size-10 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 256 256">
                <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
              </svg>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

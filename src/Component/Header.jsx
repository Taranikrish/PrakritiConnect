import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleDashboardNavigation = () => {
    if (role === 'organizer') {
      navigate(`/organizer-dashboard/${user?.uid}`);
    } else if (role === 'volunteer') {
      navigate('/volunteer-dashboard');
    } else {
      navigate('/home');
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7f3ef] px-4 md:px-10 py-3 relative">
      {/* Logo */}
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

      {/* Desktop Navigation */}
      {isAuthenticated && (
        <div className="hidden md:flex lg:px-10 md:px-8 md:justify-evenly md:flex-1 items-center gap-9">
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

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex justify-end gap-8">
        {!isAuthenticated ? (
          <div className="flex gap-2">
            <button 
              className="flex md:min-w-[84px] w-4 h-10 px-4 items-center justify-center rounded-lg bg-[#14b881] text-[#0e1b17] text-sm font-bold hover:bg-[#0fa36d] transition-colors"
              onClick={() => handleNavigation("/")}
            >
              Sign up
            </button>
            <button 
              className="flex md:min-w-[84px] min-w-10 h-10 px-4 items-center justify-center rounded-lg bg-[#e7f3ef] text-[#0e1b17] text-sm font-bold hover:bg-[#d0e7df] transition-colors"
              onClick={() => handleNavigation("/")}
            >
              Log in
            </button>
          </div>
        ) : (
          <>
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

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md text-[#0e1b17] hover:bg-[#e7f3ef] transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-[#e7f3ef] shadow-lg z-50">
          <div className="px-4 py-3 space-y-3">
            {isAuthenticated && (
              <>
                <button 
                  className="block w-full text-left text-[#0e1b17] text-sm font-medium hover:text-[#14b881] transition-colors py-2"
                  onClick={() => handleNavigation("/home")}
                >
                  Home
                </button>
                <button 
                  className="block w-full text-left text-[#0e1b17] text-sm font-medium hover:text-[#14b881] transition-colors py-2"
                  onClick={() => handleNavigation("/events")}
                >
                  Events
                </button>
                <button 
                  className="block w-full text-left text-[#0e1b17] text-sm font-medium hover:text-[#14b881] transition-colors py-2"
                  onClick={() => handleNavigation("/organizations")}
                >
                  Organizations
                </button>
                <button 
                  className="block w-full text-left text-[#0e1b17] text-sm font-medium hover:text-[#14b881] transition-colors py-2"
                  onClick={() => handleNavigation("/about")}
                >
                  About
                </button>
                <button 
                  className="block w-full text-left text-[#0e1b17] text-sm font-medium hover:text-[#14b881] transition-colors py-2"
                  onClick={handleDashboardNavigation}
                >
                  Dashboard
                </button>
              </>
            )}
            {!isAuthenticated ? (
              <div className="space-y-2 pt-2 border-t border-[#e7f3ef]">
                <button 
                  className="block w-full text-center py-2 rounded-lg bg-[#14b881] text-[#0e1b17] text-sm font-bold hover:bg-[#0fa36d] transition-colors"
                  onClick={() => handleNavigation("/")}
                >
                  Sign up
                </button>
                <button 
                  className="block w-full text-center py-2 rounded-lg bg-[#e7f3ef] text-[#0e1b17] text-sm font-bold hover:bg-[#d0e7df] transition-colors"
                  onClick={() => handleNavigation("/")}
                >
                  Log in
                </button>
              </div>
            ) : (
              <button 
                className="block w-full text-left text-[#0e1b17] text-sm font-medium hover:text-[#14b881] transition-colors py-2"
                onClick={handleDashboardNavigation}
              >
                Profile
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

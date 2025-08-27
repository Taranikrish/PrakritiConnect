import React from "react";
import Header from "../Component/Header";
import { useSelector } from "react-redux";

const About = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="relative flex min-h-screen flex-col bg-[#f8fcfa] font-['Plus Jakarta Sans','Noto Sans',sans-serif]">
      <Header isAuthenticated={isAuthenticated} />
      
      <div className="px-4 md:px-8 lg:px-40 flex flex-1 justify-center py-10">
        <div className="w-full max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-[#0e1b17] text-3xl md:text-4xl font-bold mb-6">About PrakritiConnect</h1>
            <p className="text-[#4e977f] text-lg max-w-3xl mx-auto">
              Connecting passionate volunteers with meaningful environmental initiatives to create sustainable change in our communities.
            </p>
          </div>

          {/* Mission Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="bg-gray-100 rounded-lg p-8">
              <h2 className="text-[#0e1b17] text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-[#4e977f] mb-6">
                To empower individuals and organizations to collaborate on environmental conservation efforts, 
                making it easier for everyone to contribute to a greener, more sustainable future.
              </p>
              <p className="text-[#4e977f]">
                We believe that collective action is the key to addressing environmental challenges, 
                and we're building the tools to make that collaboration seamless and effective.
              </p>
            </div>
            <div className="bg-[#e7f3ef] rounded-lg p-8">
              <h3 className="text-[#0e1b17] text-xl font-bold mb-4">What We Offer</h3>
              <ul className="text-[#4e977f] space-y-3">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#14b881] rounded-full mr-3"></span>
                  Event creation and management for organizers
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#14b881] rounded-full mr-3"></span>
                  Easy volunteer registration and participation
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#14b881] rounded-full mr-3"></span>
                  Organization profiles and collaboration tools
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#14b881] rounded-full mr-3"></span>
                  Real-time updates and communication
                </li>
              </ul>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="mb-16">
            <h2 className="text-[#0e1b17] text-2xl font-bold mb-8 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-[#14b881] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">1</span>
                </div>
                <h3 className="text-[#0e1b17] text-lg font-bold mb-2">Sign Up</h3>
                <p className="text-[#4e977f]">Create your account as a volunteer or organizer</p>
              </div>
              <div className="text-center">
                <div className="bg-[#14b881] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">2</span>
                </div>
                <h3 className="text-[#0e1b17] text-lg font-bold mb-2">Connect</h3>
                <p className="text-[#4e977f]">Find events or create your own initiatives</p>
              </div>
              <div className="text-center">
                <div className="bg-[#14b881] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">3</span>
                </div>
                <h3 className="text-[#0e1b17] text-lg font-bold mb-2">Make Impact</h3>
                <p className="text-[#4e977f]">Participate in events and track your contributions</p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-[#e7f3ef] rounded-lg p-8 text-center">
            <h2 className="text-[#0e1b17] text-2xl font-bold mb-4">Get In Touch</h2>
            <p className="text-[#4e977f] mb-6">
              Have questions or want to collaborate? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:taranikrish7@gmail.com" className="bg-[#14b881] text-white px-6 py-3 rounded-lg hover:bg-[#0fa36d] transition-colors">
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

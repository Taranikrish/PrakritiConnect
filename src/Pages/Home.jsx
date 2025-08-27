import React, { useState, useEffect } from "react";
import Header from "../Component/Header";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const Home = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleExploreEvents = () => {
    navigate("/events");
  };

  const handleFindMore = () => {
    navigate("/events");
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsQuery = query(
          collection(db, "events"),
          orderBy("startDate", "asc")
        );
        
        const eventsSnapshot = await getDocs(eventsQuery);
        const eventsData = [];
        const currentDate = new Date();
        
        for (const eventDoc of eventsSnapshot.docs) {
          const eventData = { id: eventDoc.id, ...eventDoc.data() };
          const eventDateStr = eventData.startDate;
          const currentDateStr = currentDate.toISOString().split('T')[0];
          
          if (eventDateStr < currentDateStr) {
            continue; // Skip past events
          }
          
          // Fetch organizer's organization name
          let organizationName = "Organization";
          if (eventData.organizerId) {
            try {
              const organizerDoc = await getDoc(doc(db, "organizers", eventData.organizerId));
              if (organizerDoc.exists()) {
                organizationName = organizerDoc.data().orgName || "Organization";
              }
            } catch (error) {
              console.error("Error fetching organizer data:", error);
            }
          }
          
          eventsData.push({
            ...eventData,
            organization: organizationName
          });
        }
        
        setEvents(eventsData.slice(0, 3)); // Limit to 3 upcoming events
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen flex-col bg-[#f8fcfa] font-['Plus Jakarta Sans','Noto Sans',sans-serif]">
        <Header isAuthenticated={true} />
        <div className="flex items-center justify-center flex-1">
          <p className="text-[#4e977f] text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex min-h-screen flex-col bg-[#f8fcfa] font-['Plus Jakarta Sans','Noto Sans',sans-serif]">
        <Header isAuthenticated={true} />
        <div className="flex items-center justify-center flex-1">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#f8fcfa] group/design-root overflow-x-hidden" style={{fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif'}}>
      <div className="layout-container flex h-full grow flex-col">
        <Header isAuthenticated={true} />
        <div className="px-4 md:px-8 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 w-full">
            {/* Hero Section */}
            <div className="w-full">
              <div className="p-4">
                <div
                  className="flex min-h-[400px] md:min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat md:gap-8 md:rounded-lg items-center justify-center p-4"
                  style={{backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuANehG9EjaJ-aPRTWeX0n76R8j_F6Aqk8PdFhE6JRFVR3srrm5Tx-ubWj-IdEDhjYWffjCeYNk8VRJUXAlqWSbwr-AiW-m3bd23kDeLUt9PgVISLyyojp6JbcdzsvFB0Fc8QIcADLn-_bbNgQxLYvoMTUbyWNm35iWw14s5w79_ioqZSSN71Yq6Jo5K5i2-D27AljOe9zKFBn7QmxCPV9vguXmGjc9BSCVh0En8-ti3LOTXVgluIOh1zvOMJ-RP7qxLPAybSrESFlVL")'}}
                >
                  <div className="flex flex-col gap-2 text-center">
                    <h1
                      className="text-white text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em]"
                    >
                      Empowering Organizers. Inspiring Volunteers.
                    </h1>
                    <h2 className="text-white text-sm md:text-base font-normal leading-normal">
                      A platform where people come together to create change.
                    </h2>
                  </div>
                  <button
                    onClick={handleExploreEvents}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 md:h-12 px-4 md:px-5 bg-[#14b881] text-[#0e1b17] text-sm md:text-base font-bold leading-normal tracking-[0.015em]"
                  >
                    <span className="truncate">Explore Events</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Upcoming Events Section */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-[#0e1b17] tracking-light text-2xl md:text-3xl font-bold leading-tight">Upcoming Events</p>
                <p className="text-[#4e977f] text-sm font-normal leading-normal">Explore events happening near you and make a difference.</p>
              </div>
            </div>

            {/* Events List */}
            {events.map((event) => (
              <div key={event.id} className="p-4 cursor-pointer" onClick={() => navigate(`/event/${event.id}`)}>
                <div className="flex flex-col items-stretch justify-start rounded-lg md:flex-row md:items-start shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-[#f8fcfa] hover:shadow-[0_0_8px_rgba(0,0,0,0.2)] transition-shadow">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                    style={{backgroundImage: `url(${event.bannerUrl || "https://default-banner-url.com"})`}}
                  ></div>
                  <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 md:px-4 px-4">
                    <p className="text-[#4e977f] text-sm font-normal leading-normal">{event.organization}</p>
                    <p className="text-[#0e1b17] text-lg font-bold leading-tight tracking-[-0.015em]">{event.eventName}</p>
                    <div className="flex items-end gap-3 justify-between">
                      <div className="flex flex-col gap-1">
                        <p className="text-[#4e977f] text-base font-normal leading-normal">
                          {event.description}
                        </p>
                        <p className="text-[#4e977f] text-base font-normal leading-normal">
                          {formatDate(event.startDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Find More Button */}
            <div className="flex justify-center p-4">
              <button
                onClick={handleFindMore}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#14b881] text-[#0e1b17] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Find More Events</span>
              </button>
            </div>

            {/* How It Works Section */}
            <h2 className="text-[#0e1b17] text-xl md:text-2xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              <div className="flex flex-1 gap-3 rounded-lg border border-[#d0e7df] bg-[#f8fcfa] p-4 flex-col">
                <div className="text-[#0e1b17]" data-icon="User" data-size="24px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-[#0e1b17] text-base font-bold leading-tight">Sign Up</h2>
                  <p className="text-[#4e977f] text-sm font-normal leading-normal">Create your profile and start exploring.</p>
                </div>
              </div>
              <div className="flex flex-1 gap-3 rounded-lg border border-[#d0e7df] bg-[#f8fcfa] p-4 flex-col">
                <div className="text-[#0e1b17]" data-icon="Calendar" data-size="24px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-96-88v64a8,8,0,0,1-16,0V132.94l-4.42,2.22a8,8,0,0,1-7.16-14.32l16-8A8,8,0,0,1,112,120Zm59.16,30.45L152,176h16a8,8,0,0,1,0,16H136a8,8,0,0,1-6.4-12.8l28.78-38.37A8,8,0,1,0,145.07,132a8,8,0,1,1-13.85-8A24,24,0,1,1,176,136,23.76,23.76,0,0,1,171.16,150.45Z"></path>
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-[#0e1b17] text-base font-bold leading-tight">Create or Join Events</h2>
                  <p className="text-[#4e977f] text-sm font-normal leading-normal">Find events that match your interests or create your own.</p>
                </div>
              </div>
              <div className="flex flex-1 gap-3 rounded-lg border border-[#d0e7df] bg-[#f8fcfa] p-4 flex-col">
                <div className="text-[#0e1b17]" data-icon="UsersThree" data-size="24px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z"></path>
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-[#0e1b17] text-base font-bold leading-tight">Connect & Make Impact</h2>
                  <p className="text-[#4e977f] text-sm font-normal leading-normal">Connect with like-minded individuals and contribute to meaningful change.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

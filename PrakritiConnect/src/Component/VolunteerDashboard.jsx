import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, arrayUnion, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const VolunteerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [participatedEvents, setParticipatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { label: "Dashboard", active: activeMenu === "Dashboard" },
    { label: "My Events", active: activeMenu === "My Events" },
    { label: "Profile", active: activeMenu === "Profile" },
    { label: "Settings", active: activeMenu === "Settings" },
  ];

  const handleRegister = async (eventId) => {
    try {
      if (!user || !user.uid) {
        alert("Please log in to register for events.");
        return;
      }

      // Get the event document
      const eventRef = doc(db, "events", eventId);
      const eventDoc = await getDoc(eventRef);
      
      if (!eventDoc.exists()) {
        alert("Event not found.");
        return;
      }

      const eventData = eventDoc.data();
      
      // Check if volunteer is already registered
      if (eventData.participants && eventData.participants.includes(user.uid)) {
        alert("You are already registered for this event.");
        return;
      }

      // Update the event with the new participant
      await updateDoc(eventRef, {
        participants: arrayUnion(user.uid),
        participantsCount: (eventData.participantsCount || 0) + 1
      });

      // Also update the volunteer's profile with the event they registered for
      const volunteerRef = doc(db, "users", user.uid);
      await updateDoc(volunteerRef, {
        registeredEvents: arrayUnion(eventId)
      });

      alert("Successfully registered for the event!");
      
      // Refresh the events list
      const updatedVolunteerRef = doc(db, "users", user.uid);
      const updatedVolunteerDoc = await getDoc(updatedVolunteerRef);
      if (updatedVolunteerDoc.exists()) {
        const volunteerData = updatedVolunteerDoc.data();
        const registeredEventIds = volunteerData.registeredEvents || [];
        
          // Fetch details for each registered event with organization names
          const eventsPromises = registeredEventIds.map(async (eventId) => {
            const eventRef = doc(db, "events", eventId);
            const eventDoc = await getDoc(eventRef);
            if (eventDoc.exists()) {
              const eventData = { id: eventDoc.id, ...eventDoc.data() };
              
              // Fetch organization name if orgId exists
              let organizationName = "Organization";
              if (eventData.orgId && eventData.orgId !== "unknown") {
                try {
                  const orgDoc = await getDoc(doc(db, "organizers", eventData.orgId));
                  if (orgDoc.exists()) {
                    const orgData = orgDoc.data();
                    organizationName = orgData.orgName || organizationName;
                  }
                } catch (orgError) {
                  console.error("Error fetching organization:", orgError);
                }
              }
              
              return {
                ...eventData,
                organizationName: organizationName
              };
            }
            return null;
          });

        const events = await Promise.all(eventsPromises);
        const validEvents = events.filter(event => event !== null);
        setParticipatedEvents(validEvents);
      }
      
    } catch (error) {
      console.error("Error registering for event:", error);
      alert("Failed to register for the event. Please try again.");
    }
  };

  const handleMenuClick = (label) => {
    setActiveMenu(label);
    if (label === "Settings") {
      navigate("/settings");
    }
  };

  const handleViewEvent = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  useEffect(() => {
    const fetchVolunteerEvents = async () => {
      if (!user || !user.uid) {
        setLoading(false);
        return;
      }

      try {
        // Get the volunteer's profile to see which events they're registered for
        const volunteerRef = doc(db, "users", user.uid);
        const volunteerDoc = await getDoc(volunteerRef);
        
        if (volunteerDoc.exists()) {
          const volunteerData = volunteerDoc.data();
          const registeredEventIds = volunteerData.registeredEvents || [];
          
          // Fetch details for each registered event
          const eventsPromises = registeredEventIds.map(async (eventId) => {
            const eventRef = doc(db, "events", eventId);
            const eventDoc = await getDoc(eventRef);
            if (eventDoc.exists()) {
              return {
                id: eventDoc.id,
                ...eventDoc.data()
              };
            }
            return null;
          });

          const events = await Promise.all(eventsPromises);
          const validEvents = events.filter(event => event !== null);
          setParticipatedEvents(validEvents);
        }
      } catch (error) {
        console.error("Error fetching volunteer events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteerEvents();
  }, [user]);

  const completedEvents = participatedEvents.filter(event => event.status === "Completed").length;

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#f8fcfa] group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          {/* Sidebar */}
          <div className="layout-content-container flex flex-col w-80">
            <div className="flex h-full min-h-[700px] flex-col justify-between bg-[#f8fcfa] p-4">
              <div className="flex flex-col gap-4">
                {/* Profile */}
                <div className="flex gap-3">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                    style={{
                      backgroundImage: `url("https://example.com/profile.jpg")`,
                    }}
                  ></div>
                  <div className="flex flex-col">
                    <h1 className="text-[#0e1b17] text-base font-medium leading-normal">
                      {user?.fullName || "Volunteer"}
                    </h1>
                    <p className="text-[#4e977f] text-sm font-normal leading-normal">
                      Volunteer
                    </p>
                  </div>
                </div>

                {/* Menu */}
                <div className="flex flex-col gap-2">
                  {menuItems.map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
                        item.active ? "bg-[#e7f3ef]" : "hover:bg-[#e7f3ef]"
                      }`}
                      onClick={() => handleMenuClick(item.label)}
                    >
                      <p className="text-[#0e1b17] text-sm font-medium leading-normal">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Header */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-[#0e1b17] text-[32px] font-bold leading-tight">
                  Volunteer Dashboard
                </p>
                <p className="text-[#4e977f] text-sm font-normal leading-normal">
                  Track your volunteering journey
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="flex flex-wrap gap-4 p-4">
              {[
                { label: "Total Events", value: participatedEvents.length },
                { label: "Completed Events", value: completedEvents },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#d0e7df]"
                >
                  <p className="text-[#0e1b17] text-base font-medium leading-normal">
                    {stat.label}
                  </p>
                  <p className="text-[#0e1b17] text-2xl font-bold leading-tight">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Events I've Participated In */}
            <h2 className="text-[#0e1b17] text-[22px] font-bold px-4 pb-3 pt-5">
              My Volunteering History
            </h2>
            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-lg border border-[#d0e7df] bg-[#f8fcfa]">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-[#f8fcfa]">
                      {["Event Name", "Date", "Location", "Status", "Actions"].map(
                        (h, i) => (
                          <th
                            key={i}
                            className="px-4 py-3 text-left text-[#0e1b17] text-sm font-medium"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {participatedEvents.map((event, i) => (
                      <tr key={i} className="border-t border-t-[#d0e7df]">
                        <td className="px-4 py-2 text-sm text-[#0e1b17]">{event.eventName || event.name}</td>
                        <td className="px-4 py-2 text-sm text-[#4e977f]">{event.startDate || event.date || event.dateTime}</td>
                        <td className="px-4 py-2 text-sm text-[#4e977f]">
                          {event.location}
                        </td>
                        <td className="px-4 py-2">
                          <button className={`flex items-center justify-center rounded-lg h-8 px-4 text-sm font-medium ${
                            event.status === "Completed" 
                              ? "bg-[#e7f3ef] text-[#0e1b17]" 
                              : "bg-[#14b881] text-white"
                          }`}>
                            {event.status}
                          </button>
                        </td>
                        <td className="px-4 py-2">
                          <button 
                            onClick={() => handleViewEvent(event.id)}
                            className="px-3 py-1 text-sm bg-[#14b881] text-white rounded hover:bg-[#0e9c6d] transition"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Find More Events Button */}
            <div className="flex px-4 py-3 justify-end">
              <button 
                className="flex items-center justify-center rounded-lg h-10 px-4 bg-[#14b881] text-[#0e1b17] text-sm font-bold"
                onClick={() => navigate("/events")}
              >
                Find More Events
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;

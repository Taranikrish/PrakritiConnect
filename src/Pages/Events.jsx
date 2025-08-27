import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Header from "../Component/Header";
import { Link } from "react-router-dom";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Query for all events first, then filter by date in JavaScript
        // This is because Firestore date queries require the same format
        const eventsQuery = query(
          collection(db, "events"),
          orderBy("startDate", "asc")
        );
        
        const eventsSnapshot = await getDocs(eventsQuery);
        const eventsData = [];
        const currentDate = new Date();
        
        for (const eventDoc of eventsSnapshot.docs) {
          const eventData = { id: eventDoc.id, ...eventDoc.data() };
          
          // Filter for upcoming events (startDate >= current date)
          // Convert both dates to YYYY-MM-DD format for proper comparison
          const eventDateStr = eventData.startDate; // This is already in YYYY-MM-DD format
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
        
        setEvents(eventsData);
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
    <div className="relative flex min-h-screen flex-col bg-[#f8fcfa] font-['Plus Jakarta Sans','Noto Sans',sans-serif]">
      <Header isAuthenticated={true} />
      
      <div className="px-4 md:px-8 lg:px-40 flex flex-1 justify-center py-5">
        <div className="w-full max-w-6xl">
          <h1 className="text-[#0e1b17] text-2xl md:text-3xl font-bold text-center mb-8">
            Upcoming Events
          </h1>
          
          {events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#4e977f] text-lg">No upcoming events found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Event Banner */}
                  <div
                    className="w-full h-48 bg-center bg-cover bg-no-repeat"
                    style={{ backgroundImage: `url(${event.bannerUrl || "https://default-banner-url.com"})` }}
                  ></div>
                  
                  <div className="p-4">
                    {/* Organization Name */}
                    <p className="text-[#14b881] text-sm font-semibold mb-2">
                      {event.organization}
                    </p>
                    
                    {/* Event Title */}
                    <h3 className="text-[#0e1b17] text-lg md:text-xl font-bold mb-2">
                      {event.eventName}
                    </h3>
                    
                    {/* Event Description */}
                    <p className="text-[#4e977f] text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    
                    {/* Event Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-[#0e1b17]">
                        <span className="font-semibold">Date:</span>
                        <span className="ml-2">{formatDate(event.startDate)}</span>
                      </div>
                      <div className="flex items-center text-[#0e1b17]">
                        <span className="font-semibold">Location:</span>
                        <span className="ml-2">{event.location}</span>
                      </div>
                      <div className="flex items-center text-[#0e1b17]">
                        <span className="font-semibold">Participants:</span>
                        <span className="ml-2">{event.participants || 0}/{event.maxParticipants || "∞"}</span>
                      </div>
                    </div>
                    
                    {/* View Details Button */}
                    <Link
                      to={`/event/${event.id}`}
                      className="block w-full mt-4 bg-[#14b881] text-white text-center py-2 px-4 rounded-lg hover:bg-[#0fa36d] transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;

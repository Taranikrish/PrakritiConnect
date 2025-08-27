import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../Component/Header";
import EventCard from "../Component/EventCard";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc, increment, arrayUnion, arrayRemove } from "firebase/firestore";

const Event = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      
      try {
        const eventDoc = await getDoc(doc(db, "events", eventId));
        
        if (eventDoc.exists()) {
          const eventData = { id: eventDoc.id, ...eventDoc.data() };
          
          // Check if current user is already registered
          const user = auth.currentUser;
          if (user && eventData.participantIds && eventData.participantIds.includes(user.uid)) {
            setIsRegistered(true);
          }

          // Fetch organization name if orgId exists
          let organizationName = "Organization";
          console.log("Event orgId:", eventData.orgId);
          if (eventData.orgId && eventData.orgId !== "unknown") {
            try {
              const orgDoc = await getDoc(doc(db, "organizers", eventData.orgId));
              console.log("Organization document exists:", orgDoc.exists());
              if (orgDoc.exists()) {
                const orgData = orgDoc.data();
                console.log("Organization data:", orgData);
                organizationName = orgData.orgName || organizationName;
              } else {
                console.log("Organization document not found for ID:", eventData.orgId);
              }
            } catch (orgError) {
              console.error("Error fetching organization:", orgError);
            }
          } else {
            console.log("No valid orgId found in event data");
          }
          console.log("Final organization name:", organizationName);

          setEvent({
            id: eventData.id,
            title: eventData.eventName,
            description: eventData.description,
            organizer: eventData.organizerName || "Event Organizer",
            organization: organizationName,
            dateTime: eventData.startDate, // You might want to format this
            location: eventData.location,
            bannerUrl: eventData.bannerUrl || "https://default-banner-url.com",
            imageUrl: eventData.eventImage || "https://default-image-url.com",
            participants: eventData.participants || 0,
            maxParticipants: eventData.maxParticipants || 0,
            status: eventData.status || "Upcoming"
          });
        } else {
          setError("Event not found");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

const handleCancelRegistration = async (eventId) => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to cancel your registration.");
      return;
    }

    try {
      // Update Firestore to remove the user as a participant for the event
      const eventRef = doc(db, "events", eventId);
      await setDoc(eventRef, {
        participants: increment(-1),
        participantIds: arrayRemove(user.uid)
      }, { merge: true });

      // Also remove the event from the user's registered events
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        registeredEvents: arrayRemove(eventId)
      }, { merge: true });

      setIsRegistered(false);
      alert("Successfully canceled registration for the event!");
    } catch (error) {
      console.error("Error canceling registration:", error);
      alert("Failed to cancel registration for the event.");
    }
};

const handleRegister = async (eventId) => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to register for an event.");
      return;
    }

    try {
      // Update Firestore to add the user as a participant for the event
      const eventRef = doc(db, "events", eventId);
      await setDoc(eventRef, {
        participants: increment(1),
        participantIds: arrayUnion(user.uid)
      }, { merge: true });

      // Also add the event to the user's registered events
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        registeredEvents: arrayUnion(eventId)
      }, { merge: true });

      setIsRegistered(true);
      alert("Successfully registered for the event!");
    } catch (error) {
      console.error("Error registering for event:", error);
      alert("Failed to register for the event.");
    }
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen flex-col bg-[#f8fcfa] font-['Plus Jakarta Sans','Noto Sans',sans-serif]">
        <Header isAuthenticated={true} />
        <div className="flex items-center justify-center flex-1">
          <p className="text-[#4e977f] text-lg">Loading event details...</p>
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

  if (!event) {
    return (
      <div className="relative flex min-h-screen flex-col bg-[#f8fcfa] font-['Plus Jakarta Sans','Noto Sans',sans-serif]">
        <Header isAuthenticated={true} />
        <div className="flex items-center justify-center flex-1">
          <p className="text-[#4e977f] text-lg">No event data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-[#f8fcfa] font-['Plus Jakarta Sans','Noto Sans',sans-serif]">
      <Header isAuthenticated={true} />
      
      <div className="px-40 flex flex-1 justify-center py-5">
        <EventCard event={event} onRegister={isRegistered ? handleCancelRegistration : handleRegister} isRegistered={isRegistered} />
      </div>
    </div>
  );
};

export default Event;

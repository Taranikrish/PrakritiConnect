import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";

export default function CreateEvent() {
  const { user } = useSelector((state) => state.auth);
  const { orgId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    eventName: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    maxParticipants: "",
    bannerUrl: "",
    status: "upcoming",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Add event to Firestore
      const docRef = await addDoc(collection(db, "events"), {
        ...event,
        organizerId: user?.uid || "unknown",
        organizerName: user?.fullName || "Unknown Organizer",
        createdAt: new Date(),
        participants: 0,
        maxParticipants: parseInt(event.maxParticipants) || 0,
        orgId: orgId || "unknown" // Include organization ID
      });
      
      console.log("Event created with ID: ", docRef.id);
      alert("Event created successfully!");
      
      // Reset form
      setEvent({
        eventName: "",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
        maxParticipants: "",
        bannerUrl: "",
        status: "upcoming",
      });
      
      // Navigate back to dashboard
      navigate(orgId ? `/organizer-dashboard/${orgId}` : `/organizer-dashboard/${user?.uid}`);
    } catch (error) {
      console.error("Error creating event: ", error);
      alert("Error creating event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fcfa] p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0e1b17] text-2xl font-bold">Create New Event</h2>
          <button
            onClick={() => navigate(orgId ? `/organizer-dashboard/${orgId}` : `/organizer-dashboard/${user?.uid}`)}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Name */}
          <div>
            <label className="text-[#0e1b17] text-base font-medium block mb-2">
              Event Name
            </label>
            <input
              type="text"
              name="eventName"
              value={event.eventName}
              onChange={handleChange}
              placeholder="Community Garden Cleanup"
              className="w-full border border-[#d0e7df] rounded-lg px-4 py-3 text-[#0e1b17] focus:outline-none focus:border-[#14b881]"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[#0e1b17] text-base font-medium block mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={event.description}
              onChange={handleChange}
              placeholder="Enter event details..."
              rows={3}
              className="w-full border border-[#d0e7df] rounded-lg px-4 py-3 text-[#0e1b17] focus:outline-none focus:border-[#14b881]"
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#0e1b17] text-base font-medium block mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={event.startDate}
                onChange={handleChange}
                className="w-full border border-[#d0e7df] rounded-lg px-4 py-3 text-[#0e1b17] focus:outline-none focus:border-[#14b881]"
                required
              />
            </div>
            <div>
              <label className="text-[#0e1b17] text-base font-medium block mb-2">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={event.endDate}
                onChange={handleChange}
                className="w-full border border-[#d0e7df] rounded-lg px-4 py-3 text-[#0e1b17] focus:outline-none focus:border-[#14b881]"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-[#0e1b17] text-base font-medium block mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={event.location}
              onChange={handleChange}
              placeholder="Sunny Meadows Park, 123 Green St"
              className="w-full border border-[#d0e7df] rounded-lg px-4 py-3 text-[#0e1b17] focus:outline-none focus:border-[#14b881]"
              required
            />
          </div>

          {/* Max Participants */}
          <div>
            <label className="text-[#0e1b17] text-base font-medium block mb-2">
              Max Participants
            </label>
            <input
              type="number"
              name="maxParticipants"
              value={event.maxParticipants}
              onChange={handleChange}
              placeholder="50"
              className="w-full border border-[#d0e7df] rounded-lg px-4 py-3 text-[#0e1b17] focus:outline-none focus:border-[#14b881]"
              required
            />
          </div>

          {/* Banner URL */}
          <div>
            <label className="text-[#0e1b17] text-base font-medium block mb-2">
              Banner Image URL
            </label>
            <input
              type="url"
              name="bannerUrl"
              value={event.bannerUrl}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full border border-[#d0e7df] rounded-lg px-4 py-3 text-[#0e1b17] focus:outline-none focus:border-[#14b881]"
            />
          </div>

          {event.bannerUrl && (
            <div>
              <img
                src={event.bannerUrl}
                alt="Event Banner"
                className="w-full h-32 object-cover rounded-lg border border-[#d0e7df]"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(orgId ? `/organizer-dashboard/${orgId}` : `/organizer-dashboard/${user?.uid}`)}
              className="flex-1 bg-[#e7f3ef] text-[#0e1b17] rounded-lg py-3 font-medium hover:bg-[#d0e7df] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#14b881] text-white rounded-lg py-3 font-medium hover:bg-[#0e9c6d] transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

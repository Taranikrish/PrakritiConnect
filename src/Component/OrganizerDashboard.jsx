import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, where, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";

const OrganizerDashboard = ({ viewOnly = false }) => {
  const { user } = useSelector((state) => state.auth);
  const { orgId } = useParams();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [organization, setOrganization] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: "Dashboard", active: activeMenu === "Dashboard" },
    { label: "Events", active: activeMenu === "Events" },
    { label: "Volunteers", active: activeMenu === "Volunteers" },
    { label: "Donations", active: activeMenu === "Donations" },
    { label: "Settings", active: activeMenu === "Settings" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      
      try {
        // Check if the current user is the owner of this dashboard
        setIsOwner(user.uid === orgId);
        
        // Fetch organization data
        if (orgId) {
          const orgDoc = await getDoc(doc(db, "organizers", orgId));
          if (orgDoc.exists()) {
            setOrganization({ id: orgDoc.id, ...orgDoc.data() });
          }
        }
        
        // Fetch events based on whether user is owner or viewer
        const eventsQuery = query(
          collection(db, "events"),
          where("organizerId", "==", orgId || user.uid)
        );
        
        const querySnapshot = await getDocs(eventsQuery);
        const eventsData = [];
        
        querySnapshot.forEach((doc) => {
          eventsData.push({ id: doc.id, ...doc.data() });
        });
        
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.uid, orgId]);

  const handleMenuClick = (label) => {
    setActiveMenu(label);
    setIsMobileMenuOpen(false);
    if (label === "Settings") {
      navigate("/settings");
    }
  };

  const handleCreateEvent = () => {
    navigate(orgId ? `/Create-Event/${orgId}` : "/Create-Event");
  };

  const handleViewEvent = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteDoc(doc(db, "events", eventId));
        setEvents(events.filter(event => event.id !== eventId));
        alert("Event deleted successfully!");
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Error deleting event. Please try again.");
      }
    }
  };

  // Calculate statistics
  const totalEvents = events.length;
  const upcomingEvents = events.filter(event => 
    new Date(event.startDate) > new Date()
  ).length;
  const activeVolunteers = events.reduce((total, event) => total + (event.participants || 0), 0);
  const totalDonations = events.reduce((total, event) => total + (event.donations || 0), 0);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getEventStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Reset time part for accurate date comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventStart = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const eventEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    
    if (today < eventStart) return "Upcoming";
    if (today >= eventStart && today <= eventEnd) return "Active";
    return "Completed";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Upcoming": return "bg-blue-100 text-blue-800";
      case "Completed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#f8fcfa] group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        {/* Mobile Menu Button */}
        <div className="md:hidden p-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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

        <div className="gap-1 px-4 md:px-6 flex flex-1 justify-center py-5">
          {/* Sidebar */}
          <div className={`layout-content-container flex-col w-80 ${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex`}>
            <div className="flex h-full min-h-[700px] flex-col justify-between bg-[#f8fcfa] p-4">
              <div className="flex flex-col gap-4">
                {/* Profile */}
                <div className="flex gap-3">
                  
                  <div className="flex flex-col">
                    <h1 className="text-[#0e1b17] text-base font-medium leading-normal">
                      {organization?.orgName || user?.fullName || "Organizer"}
                    </h1>
                    <p className="text-[#4e977f] text-sm font-normal leading-normal">
                      {isOwner ? "Organizer" : "Viewing Organization"}
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
                <p className="text-[#0e1b17] text-2xl md:text-[32px] font-bold leading-tight">
                  Dashboard
                </p>
                <p className="text-[#4e977f] text-sm font-normal leading-normal">
                  Manage your events and track progress
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="flex flex-wrap gap-4 p-4">
              {[
                { label: "Total Events", value: totalEvents },
                { label: "Active Volunteers", value: activeVolunteers },
                { label: "Total Donations", value: `$${totalDonations.toLocaleString()}` },
                { label: "Upcoming Events", value: upcomingEvents },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-4 md:p-6 border border-[#d0e7df]"
                >
                  <p className="text-[#0e1b17] text-sm md:text-base font-medium leading-normal">
                    {stat.label}
                  </p>
                  <p className="text-[#0e1b17] text-xl md:text-2xl font-bold leading-tight">
                    {loading ? "..." : stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Events Organized */}
            <h2 className="text-[#0e1b17] text-xl md:text-[22px] font-bold px-4 pb-3 pt-5">
              Events Organized
            </h2>
            <div className="px-4 py-3">
              {loading ? (
                <div className="text-center py-8 text-[#4e977f]">Loading events...</div>
              ) : events.length === 0 ? (
                <div className="text-center py-8 text-[#4e977f]">
                  No events created yet. Create your first event to get started!
                </div>
              ) : (
                <div className="overflow-auto scrollbar-hide rounded-lg border border-[#d0e7df] bg-white">
                  {/* Mobile View */}
                  <div className="md:hidden space-y-4 p-4">
                    {events.map((event) => {
                      const status = getEventStatus(event.startDate, event.endDate);
                      const statusColor = getStatusColor(status);
                      
                      return (
                        <div key={event.id} className="border border-[#d0e7df] rounded-lg p-4">
                          <div className="text-sm font-medium text-[#0e1b17] mb-2">
                            {event.eventName}
                          </div>
                          <div className="text-sm text-[#4e977f] mb-3">
                            {event.description?.substring(0, 50)}...
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div>
                              <div className="text-[#4e977f]">Date</div>
                              <div>{formatDate(event.startDate)}</div>
                            </div>
                            <div>
                              <div className="text-[#4e977f]">Location</div>
                              <div>{event.location}</div>
                            </div>
                            <div>
                              <div className="text-[#4e977f]">Volunteers</div>
                              <div>{event.participants || 0}/{event.maxParticipants || 0}</div>
                            </div>
                            <div>
                              <div className="text-[#4e977f]">Status</div>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                                {status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleViewEvent(event.id)}
                              className="flex-1 px-3 py-1 text-sm bg-[#14b881] text-white rounded hover:bg-[#0e9c6d] transition"
                            >
                              View
                            </button>
                            {isOwner && !viewOnly && (
                              <button 
                                onClick={() => handleDeleteEvent(event.id)}
                                className="flex-1 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-700 transition"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Desktop View */}
                  <table className="hidden md:table w-full">
                    <thead className="bg-[#f8fcfa]">
                      <tr>
                        {["Event Name", "Date", "Location", "Volunteers", "Status", "Actions"].map(
                          (h, i) => (
                            <th
                              key={i}
                              className="px-6 py-4 text-left text-[#0e1b17] text-sm font-medium uppercase tracking-wider"
                            >
                              {h}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#d0e7df]">
                      {events.map((event) => {
                        const status = getEventStatus(event.startDate, event.endDate);
                        const statusColor = getStatusColor(status);
                        
                        return (
                          <tr key={event.id} className="hover:bg-[#f8fcfa] transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-[#0e1b17]">
                                {event.eventName}
                              </div>
                              <div className="text-sm text-[#4e977f]">
                                {event.description?.substring(0, 50)}...
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-[#4e977f]">
                                {formatDate(event.startDate)}
                              </div>
                              {event.endDate && event.endDate !== event.startDate && (
                                <div className="text-xs text-gray-500">
                                  to {formatDate(event.endDate)}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-[#4e977f]">
                                {event.location}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-[#4e977f]">
                                <span className="font-medium">{event.participants || 0}</span>
                                <span className="text-gray-500">/{event.maxParticipants || 0}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div 
                                  className="bg-[#14b881] h-2 rounded-full" 
                                  style={{ width: `${Math.min(100, ((event.participants || 0) / (event.maxParticipants || 1)) * 100)}%` }}
                                ></div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                                {status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleViewEvent(event.id)}
                                  className="px-3 py-1 text-sm bg-[#14b881] text-white rounded hover:bg-[#0e9c6d] transition"
                                >
                                  View
                                </button>
                                {isOwner && !viewOnly && (
                                  <button 
                                    onClick={() => handleDeleteEvent(event.id)}
                                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-700 transition"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Create Event Button */}
            {isOwner && !viewOnly && (
              <div className="flex px-4 py-3 justify-end">
                <button 
                  onClick={handleCreateEvent}
                  className="flex items-center justify-center rounded-lg h-10 px-4 bg-[#14b881] text-[#0e1b17] text-sm font-bold"
                >
                  Create New Event
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;

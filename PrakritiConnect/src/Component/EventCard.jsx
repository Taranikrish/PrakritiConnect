import React from "react";

const EventCard = ({ event, onRegister, isRegistered = false }) => {
  return (
    <div className="layout-content-container flex flex-col gap-y-3 max-w-[960px] flex-1 mx-auto p-4">
      <h2 className="text-[#0e1b17] flex justify-center text-2xl md:text-3xl font-bold px-4 pt-2">{event.organization}</h2>

      {/* Event Title + Description */}
      <div className="flex flex-wrap justify-between gap-y-4 p-4">
        <div className="flex min-w-72 flex-col gap-3">
          <p className="text-[#0e1b17] text-xl font-bold leading-tight">
            Title:
            {event.title}
          </p>
          <p className="text-[#4e977f] text-sm font-normal leading-normal">
            {event.description}
          </p>
        </div>
      </div>

      {/* Event Details */}
      <h3 className="text-[#0e1b17] text-lg font-bold px-4 pb-2 pt-4">
        Event Details
      </h3>
      <div className="p-4 grid grid-cols-1 md:grid-cols-[20%_1fr] gap-x-6">
        <DetailRow label="Organization" value={event.organization} />
        <DetailRow label="Organizer" value={event.organizer} />
        <DetailRow label="Date & Time" value={event.dateTime} />
        <DetailRow label="Location" value={event.location} />
      </div>

      {/* Event Image */}
      <div className="flex justify-center px-2 py-2">
        <div
          className="w-full md:w-7/10 bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
          style={{ backgroundImage: `url(${event.bannerUrl})` }}
        ></div>
      </div>
      {/* Register Button */}
      <div className="flex px-4 py-3 justify-center">
        <button 
          onClick={() => onRegister(event.id)} 
          className="flex w-full md:min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-12 px-5 bg-[#14b881] text-[#0e1b17] text-base font-bold hover:bg-[#0fa36d] transition">
          {isRegistered ? "Cancel Registration" : "Register as Volunteer"}
        </button>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="col-span-2 grid grid-cols-1 md:grid-cols-subgrid border-t border-t-[#d0e7df] py-5">
    <p className="text-[#4e977f] text-sm font-normal">{label}</p>
    <p className="text-[#0e1b17] text-sm font-normal">{value}</p>
  </div>
);

export default EventCard;

import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Header from "../Component/Header";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

const Organizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
  const fetchOrganizations = async () => {
    try {
      const orgsQuery = collection(db, "organizers");
      const orgsSnapshot = await getDocs(orgsQuery);
      const orgsData = [];

      orgsSnapshot.forEach((doc) => {
        orgsData.push({ id: doc.id, ...doc.data() });
      });

      setOrganizations(orgsData);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      setError("Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  fetchOrganizations();
}, []);

if (loading) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#f8fcfa] font-['Plus Jakarta Sans','Noto Sans',sans-serif]">
      <Header isAuthenticated={true} />
      <div className="flex items-center justify-center flex-1">
        <p className="text-[#4e977f] text-lg">Loading organizations...</p>
      </div>
    </div>
  );
}

if (error) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#f8fcfa] font-['Plus Jakarta Sans','极oto Sans',sans-serif]">
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
          Organizations
        </h1>
        {organizations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#4e977f] text-lg">No organizations found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {organizations.map((org) => (
              <div
                key={org.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-4">
                  <h3 className="text-[#0e1b17] text-lg md:text-xl font-bold mb-2">
                    {org.orgName}
                  </h3>
                  <Link
                    to={user?.role === 'organizer' ? `/organizer-dashboard/${org.id}` : `/view-organization/${org.id}`}
                    className="block w-full mt-4 bg-[#14b881] text-white text-center py-2 px-4 rounded-lg hover:bg-[#0fa36d] transition"
                  >
                    View Dashboard
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

export default Organizations;

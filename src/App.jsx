import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./Pages/Auth";
import Home from "./Pages/Home";
import Event from "./Pages/Event";
import Events from "./Pages/Events";
import Organizations from "./Pages/Organizations";
import About from "./Pages/About";
import OrganizerSignup from "./Component/OrganizerSignUp";
import VolunteerSignup from "./Component/VolunteerSignup";
import Login from "./Component/Login";
import OrganizerDashboard from "./Component/OrganizerDashboard";
import VolunteerDashboard from "./Component/VolunteerDashboard";
import Settings from "./Component/Settings";
import ProtectedRoute from "./Component/ProtectedRoute";
import CreateEvent from "./Component/CreateEvent";
import Footer from "./Component/Footer";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/home" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/events" element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            } />
            <Route path="/organizations" element={
              <ProtectedRoute>
                <Organizations />
              </ProtectedRoute>
            } />
            <Route path="/about" element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            } />
            <Route path="/event/:eventId" element={
              <ProtectedRoute>
                <Event />
              </ProtectedRoute>
            } />
            <Route path="/OrganizerSignUp" element={<OrganizerSignup/>}/>
            <Route path="/VolunteerSignUp" element={<VolunteerSignup/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/organizer-dashboard/:orgId" element={
              <ProtectedRoute requiredRole="organizer">
                <OrganizerDashboard/>
              </ProtectedRoute>
            }/>
            <Route path="/view-organization/:orgId" element={
              <ProtectedRoute>
                <OrganizerDashboard viewOnly={true}/>
              </ProtectedRoute>
            }/>
            <Route path="/volunteer-dashboard" element={
              <ProtectedRoute requiredRole="volunteer">
                <VolunteerDashboard/>
              </ProtectedRoute>
            }/>
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings/>
              </ProtectedRoute>
            }/>
            <Route path="/Create-Event" element={
              <ProtectedRoute requiredRole="organizer">
                <CreateEvent/>
              </ProtectedRoute>
            }/>
            <Route path="/Create-Event/:orgId" element={
              <ProtectedRoute requiredRole="organizer">
                <CreateEvent/>
              </ProtectedRoute>
            }/>
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

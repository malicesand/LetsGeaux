import React, { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  BrowserRouter as Router,
  useParams,
  useNavigate,
  Navigate,
  useLocation,
  Link
} from 'react-router-dom';
import axios from 'axios';

// feature routes
import Home from './Home.tsx';
import Login from './Login.tsx';
import Maps from './Maps.tsx';
import Suggestions from './Suggestions.tsx';
import ChatBot from './Chat/ChatBot.tsx';
import Itinerary from './Itinerary/Itinerary.tsx'
import BudgetBuddy from './BudgetBuddy/BudgetBuddy.tsx';
import Activities from './Itinerary/NEWActivties.tsx';
import ActivitiesChoices from './RouteChoices';
import Logout from './Logout.tsx';
import Calendar from './Itinerary/Calendar.tsx';
import RouteChoices from './RouteChoices.tsx';
import Wishlist from './Wishlists.tsx';
import MainAppBar from './AppBar';
import { user } from '../../../types/models.ts';
//import Activity from './NEWActivties.tsx';
import Profile from './Profile.tsx';
import Dashboard from './Dashboard/DashboardMain.tsx'
import ViewCodeForm from './Itinerary/viewCodeForm.tsx';
import CommunityPage from './Community/CommunityPage.tsx';
import PartyDashboard from './Dashboard/PartyDashboard.tsx';
import { useUser } from './UserContext'
import InterestForm from './InterestForm';
import CalendarPage from './Itinerary/CalendarPage.tsx';
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(undefined);
  const [user, setUser] = useState<user | null>(null);
  const location = useLocation(); // gets current route
  const { setLocalUser } = useUser();
  // Check Auth
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/check-auth');
        setIsAuthenticated(response.data.isAuthenticated);

        if (response.data.isAuthenticated) {
          const fetchedUser: user = response.data.user;
          setUser(fetchedUser);
          setLocalUser({ profilePic: fetchedUser.profilePic })
          localStorage.removeItem('sessionId');
        }
      } catch (error) {
        setIsAuthenticated(false);
        console.error('Server: Err checking auth status', error);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === undefined) {
    return <div>Loading...</div>
  }
  // Protected Route
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to='/login' replace />;
    }
    return <>{children}</>;
  };

  

  // Show AppBar if authenticated & not on the login page
  const showAppBar = isAuthenticated && location.pathname !== 'login' && location.pathname !== '/logout';
  

  return (

    <>
      {showAppBar && <MainAppBar setIsAuthenticated={setIsAuthenticated} user={user} />}
      <Routes>
        <Route
          path='/login'
          element={!isAuthenticated ? <Login /> : <Navigate to='/' replace />}
        />

        <Route
          path='/'
          element={
            <ProtectedRoute>{user && <Home user={user} />}</ProtectedRoute>
          }
        />
        <Route
          path='/maps'
          element={
            <ProtectedRoute>
              <Maps />
            </ProtectedRoute>
          }
        />
        <Route
          path='/suggestions'
          element={
            <ProtectedRoute>
              {user && <Suggestions user={user} />}
            </ProtectedRoute>
          }
        />
        <Route
          path='/wishlist'
          element={
            <ProtectedRoute>{user && <Wishlist user={user} />}</ProtectedRoute>
          }
        />
        <Route
          path='/chatbot'
          element={
            <ProtectedRoute>{user && <ChatBot user={user} />}</ProtectedRoute>
          }
        />
        <Route
          path='/itinerary'
          element={
            <ProtectedRoute>{user && <Itinerary user={user} />}</ProtectedRoute>
          }
        />

        <Route path="/itinerary/:id" element={<Itinerary user={user} />} />

        <Route
          path='/budgetbuddy'
          element={
            <ProtectedRoute>
              <BudgetBuddy />
            </ProtectedRoute>
          }
        />
        <Route
          path='/routechoices'
          element={
            <ProtectedRoute>
              <RouteChoices />
            </ProtectedRoute>
          }
        />
        <Route
          path='/Community'
          element={
            <ProtectedRoute>
              {user && <CommunityPage user={user} />}
            </ProtectedRoute>
          }
        />
      

        <Route path='/profile' element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path='/interestform' element={
          <ProtectedRoute>
            {user && <InterestForm user={user} />}
          </ProtectedRoute>
        } />
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              {<Dashboard user={user} />}
            </ProtectedRoute>
          }
        />
        <Route
          path='/logout'
          element={
            <ProtectedRoute>
              <Logout />
            </ProtectedRoute>
          }
        />
        <Route
          path='/viewform'
          element={
            <ProtectedRoute>
              {<ViewCodeForm />}
            </ProtectedRoute>
          }
        />
        <Route
          path='/:partyId'
          element={
            <ProtectedRoute>
              <PartyDashboard user={user} />
            </ProtectedRoute>
          }
        />

<Route path='/calendar' element={
  <ProtectedRoute>
    <CalendarPage />
  </ProtectedRoute>
} />

      </Routes>
    </>

  );
};

export default App;


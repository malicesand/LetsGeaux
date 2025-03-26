import React, { useState, useEffect } from 'react';
import { 
  Routes,
  Route,
  BrowserRouter as Router, 
  useParams, 
  useNavigate, 
  Navigate,
  useLocation,
  Link  } from 'react-router-dom';
import axios from 'axios';
// mui imports


// feature routes
import Home from './Home.tsx';
import Login from './Login.tsx';
import NavDrawer from './NavDrawer.tsx';
import Maps from './Maps.tsx'
import Suggestions from './Suggestions.tsx'
import ChatBot from './ChatBot.tsx'
//! add other componenent imports BELOW this line



interface LocationState {
  message: string;
}

const App: React.FC = () => {
  // States
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check Auth
  useEffect(() => {
    const checkAuth = async (params: any) => { //? type 
      try {
        const response = await axios.get('/api/check/auth');
        setIsAuthenticated(response.data.isAuthenticated);
      }
      catch (error) {
        setIsAuthenticated(false);
        console.error('Server: Err checking auth status', error);
      }
    };

    // checkAuth(); 
  }, []); // ? need empty array?

  // Protected Route
  const ProtectedRoute = (children: any) => {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return children
  };

  return (
    <div>
      <Routes>
       <Route path="login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} /> 
        <Route path="/" element={ <Home/>}/>
        <Route path="/maps" element={<Maps/>}/>
        <Route path="/suggestions" element={<Suggestions/>}/>
        <Route path="/chatbot" element={<ChatBot/>}/>
        {/* add other paths BELOW this line */}
        


      </Routes>
    </div>
  )
};

export default App;

import React, { createContext, useContext, useState, useEffect } from 'react';
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


// feature routes
import Home from './Home.tsx';
import Login from './Login.tsx';
import NavDrawer from './NavDrawer.tsx'; // 
import Maps from './Maps.tsx'
import Suggestions from './Suggestions.tsx'
import ChatBot from './ChatBot.tsx'
//! add other componenent imports BELOW this line
import Calendar from './Calendar.tsx';
import Itinerary from './Itineraray.tsx';
import BudgetBuddy from './BudgetBuddy/BudgetBuddy.tsx';


// interface ISetAuth {
  //   setAuth: 
  // }
  
  // const Login = ({ setAuth }: ISetAuth) => {
    
  // }
  
  // States
  
  
  const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
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
    // <div>
      //  <Router>
      
      <Routes>
        {/* <NavDrawer setIsAuthenticated={setIsAuthenticated} /> */}
     
       <Route path="login" element={!isAuthenticated ? <Login /> :  <Navigate to="/" />} /> 

        <Route path="/" element={ <Home/> }/>
        {/* <Route path="/" element={<NavDrawer/>}/> */}
        <Route path="/maps" element={<Maps/>}/>
        <Route path="/suggestions" element={<Suggestions/>}/>
        <Route path="/chatbot" element={<ChatBot/>}/>
        {/* add other paths BELOW this line */}
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/itinerary" element={<Itinerary/>}/>

        <Route path="/budgetbuddy" element={<BudgetBuddy />} />

      </Routes>
// </Router>
    /* </div> */
  )
};

export default App;

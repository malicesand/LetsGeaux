import React from 'react';
import { 
  Routes,
  Route,
  BrowserRouter as Router, 
  useParams, 
  useNavigate, 
  useLocation,
  Link  } from 'react-router-dom';
import Home from './Home.tsx';

interface LocationState {
  message: string;
}

const App: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/"  element={<Home />} />
      </Routes>
    </div>
  )
}

export default App;

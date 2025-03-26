import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home.tsx';
import Suggestions from './Suggestions.tsx';
import { Container } from '@mui/material';

const App: React.FC = () => {
  return (
    <Container>
      <Routes>
        <Route path="/home"  element={<Home />} />
        <Route path="/suggestions" element={<Suggestions />} />
      </Routes>
    </Container>
  )
}

export default App;

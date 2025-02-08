// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MapScreen from './components/MapScreen';
import ARScreen from './components/ARScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapScreen />} />
        <Route path="/ar" element={<ARScreen />} />
      </Routes>
    </Router>
  );
}

export default App;

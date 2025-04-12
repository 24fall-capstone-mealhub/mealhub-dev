import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Signup1 from './pages/Signup1';
import Signup2 from './pages/Signup2';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup1" element={<Signup1 />} />
        <Route path="/signup2" element={<Signup2 />} />
      </Routes>
    </Router>
  );
}

export default App;
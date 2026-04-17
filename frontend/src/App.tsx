import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import StudentDiscovery from './pages/StudentDiscovery';
import SchoolShowcase from './pages/SchoolShowcase';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/student-dashboard" element={<StudentDiscovery />} />
          <Route path="/discover" element={<StudentDiscovery />} />
          <Route path="/school-dashboard" element={<SchoolShowcase />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Pages imported below
import Home from './Pages/Home/Home.js';
import Signin from './Pages/Signin/Signin.js';
import Verify from './Pages/Verify/Verify.js';
import Dashboard from './Components/Dashboard/Dashboard.js';

export default function App() {
  const isSmallScreen = window.innerWidth < 768; // You may adjust the breakpoint as needed

  return (
    <Router>
      {/* controls the look of all toasts */}
      <ToastContainer
        position={isSmallScreen ? "bottom-center" : "top-right"}
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        stacked={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Sign-In" element={<Signin />} />
        <Route path="/Verify" element={<Verify />} />
        <Route
          path="/Dashboard/*"
          element={<Dashboard />}
        />
      </Routes>
    </Router>
  );
}

import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//pages imported below
import Home from './Pages/Home/Home.js'
import Signin from './Pages/Signin/Signin.js'
import Dashboard from './Components/Dashboard/Dashboard.js'
export default function App() {
  //mostly react router dom stuff
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Sign-In" element={<Signin />} />
        <Route path="/Dashboard/*" element={<Dashboard />} />
      </Routes>
    </Router>
    
  )
}

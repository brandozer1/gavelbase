import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//pages imported below
import Home from './Pages/Home/Home.js'
import Login from './Pages/Login/Login.js'
export default function App() {
  //mostly react router dom stuff
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
    
  )
}

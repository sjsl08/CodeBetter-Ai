import React, { useState, useEffect } from 'react';

import "./App.css"
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from "react-router-dom"
import Login from './components/Login';
import Signup from './components/Signup';
import Layout from './components/Layout';
import BG from './components/BG';
import Dashboard from './components/Dashboard';
import { AppContextProvider } from './utils/AppContext';
import AlertHead from './AlertHead';
import { Register } from './Register';




const App = () => {

  return (

    <Router>
      <AppContextProvider>
        <Layout>
          <Routes>
            {/* <Route path="/a" element={<AlertHead />} /> */}
            <Route path="/" element={<Register />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/login" element={<Login />} /> */}

          </Routes>
        </Layout>
      </AppContextProvider>
    </Router>

  )
};

export default App;

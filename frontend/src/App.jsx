// src/App.jsx
// PURPOSE: Main entry point for the application routing and global context providers.

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import Navbar from './components/Navbar';
import Marketplace from './pages/Marketplace';
import MyTrades from './pages/MyTrades';
import NewListing from './pages/NewListing';

function App() {
  return (
    <WalletProvider>
      <Router>
        <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
          
          {/* Navbar is rendered outside the Routes so it appears on every page */}
          <Navbar />
          
          {/* Main content area */}
          <main style={{ padding: '2rem' }}>
            <Routes>
              <Route path="/" element={<Marketplace />} />
              <Route path="/my-trades" element={<MyTrades />} />
              <Route path="/new-listing" element={<NewListing />} />
            </Routes>
          </main>
          
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;
// src/components/Navbar.jsx
// PURPOSE: Global navigation header that allows users to route between pages and connect their wallet.

import React, { useContext } from 'react';
import { Link } from 'react-router-dom'; // Assuming you use react-router-dom for routing
import { WalletContext } from '../context/WalletContext';

const Navbar = () => {
  const { currentAccount, connectWallet } = useContext(WalletContext);

  // Helper function to shorten the wallet address for display
  const shortenAddress = (address) => `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', backgroundColor: '#FFFFFF', borderBottom: '2px solid #E2E8F0' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 style={{ color: '#1D4ED8', margin: 0, fontWeight: 'bold' }}>CampusTrust</h1>
      </div>
      {/*Links*/}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#334155', fontWeight: '500' }}>Marketplace</Link>
        <Link to="/my-trades" style={{ textDecoration: 'none', color: '#334155', fontWeight: '500' }}>My Trades</Link>
        <Link to="/new-listing" style={{ textDecoration: 'none', color: '#334155', fontWeight: '500' }}>New Listing</Link>
      </div>
      {/* Wallet Connection Button */}
      <div>
        {!currentAccount ? (
          <button 
            onClick={connectWallet}
            style={{ backgroundColor: '#1D4ED8', color: '#FFFFFF', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
          >
            Connect Wallet
          </button>
        ) : (
          <div style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 'bold' }}>
            {shortenAddress(currentAccount)}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
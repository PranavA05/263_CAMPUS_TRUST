// src/pages/MyTrades.jsx
// PURPOSE: Allows users to see items they have bought/sold and release escrow funds.

import React, { useState, useEffect, useContext } from 'react';
import { getContract } from '../utils/web3Config';
import { WalletContext } from '../context/WalletContext';

const MyTrades = () => {
  const { currentAccount } = useContext(WalletContext);
  const [activeTrades, setActiveTrades] = useState([]);

  const fetchMyTrades = async () => {
    try {
      const contract = await getContract();
      const total = await contract.getTotalListings();
      
      let myItems = [];
      for (let i = 1; i <= total; i++) {
        const item = await contract.getListing(i);
        // If the connected wallet is the buyer and the funds are Locked (state == 1)
        if (item.buyer.toLowerCase() === String(currentAccount).toLowerCase()){
          myItems.push(item);
        }
      }
      setActiveTrades(myItems);
    } catch (error) {
      console.error("Error fetching trades:", error);
    }
  };

  useEffect(() => {
    if (currentAccount) fetchMyTrades();
  }, [currentAccount]);

  const confirmReceipt = async (id) => {
    try {
      const contract = await getContract();
      const tx = await contract.confirmReceipt(id);
      await tx.wait();
      
      alert("Funds released to the seller. Trade complete!");
      fetchMyTrades(); // Refresh the list
    } catch (error) {
      console.error("Failed to release funds:", error);
    }
  };

  return (
    <div>
      <h2 style={{ color: '#1D4ED8' }}>My Active Trades</h2>
      {activeTrades.length === 0 ? <p>No active trades requiring your confirmation.</p> : null}
      
      {activeTrades.map(item => (
        <div key={item.id.toString()} style={{ backgroundColor: '#DBEAFE', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <img 
            src={item.photoUrl.replace("gateway.pinata.cloud", "ipfs.io")} 
            alt={item.title} 
            style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }} 
            />
          <h3>{item.title}</h3>
          <p>Status: Funds Locked Safely</p>
          <button 
            onClick={() => confirmReceipt(item.id)}
            style={{ backgroundColor: '#1D4ED8', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Confirm Item Received
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyTrades;
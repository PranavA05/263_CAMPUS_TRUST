// src/pages/MyTrades.jsx
// Purpose: Displays active trades for the connected user where they have locked funds in the contract and need to confirm receipt to release funds to the seller.

import React, { useState, useEffect, useContext } from 'react';
import { getContract } from '../utils/web3Config';
import { WalletContext } from '../context/WalletContext';
import { getIPFSUrl } from '../utils/imageHelper';

const MyTrades = () => { // connected wallet 
  const { currentAccount } = useContext(WalletContext);
  const [activeTrades, setActiveTrades] = useState([]);
  const fetchMyTrades = async () => { // fetches all listings and filters for those where the current user is the buyer and state is 1 (funds locked)
  try {
    const contract = await getContract();
    const total = await contract.getTotalListings();
    let myItems = [];

    for (let i = 1; i <= total; i++) { // compare buyer address to current account and check if state is 1 
      const item = await contract.getListing(i);
      console.log("Item", i, {
        buyer: item.buyer,
        currentAccount,
        state: item.state,
        stateType: typeof item.state,
        buyerMatch: item.buyer.toLowerCase() === String(currentAccount).toLowerCase(),
        stateMatch: item.state === 1
      });
      if (
        item.buyer.toLowerCase() === String(currentAccount).toLowerCase() &&
        item.state === 1
      ) {
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

  const confirmReceipt = async (id) => { // calls smart contracts to confirm receipt and release funds to seller, then refreshes active trades
    try {
      const contract = await getContract();
      const tx = await contract.confirmReceipt(id);
      await tx.wait();
      alert("Funds released to the seller. Trade complete!");
      fetchMyTrades();
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
            src={getIPFSUrl(item.photoUrl)}
            alt={item.title}
            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
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
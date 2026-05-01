// src/pages/Marketplace.jsx
// PURPOSE: Displays available items and allows buyers to lock their funds into the escrow contract.

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getContract } from '../utils/web3Config';

const Marketplace = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const contract = await getContract();
      const total = await contract.getTotalListings();
      
      let fetchedItems = [];
      for (let i = 1; i <= total; i++) {
        const item = await contract.getListing(i);
        // Only show items that are 'Available' (state == 0)
        if (item.state === 0) {
          fetchedItems.push(item);
        }
      }
      const availableItems = fetchedItems.filter(item => 
      item.buyer === "0x0000000000000000000000000000000000000000");
      setItems(availableItems);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handlePurchase = async (id, priceInWei) => {
    try {
      const contract = await getContract();
      const transaction = await contract.payForListing(id, { value: priceInWei });
      await transaction.wait();
      
      alert("Funds locked securely. Meet the seller!");
      fetchListings(); // Refresh the page to remove the bought item
    } catch (error) {
      console.error("Purchase failed:", error);
    }
  };

  return (
    <div>
      <h2 style={{ color: '#1D4ED8' }}>Campus Marketplace</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {items.map((item) => (
          <div key={item.id.toString()} style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <img 
            src={item.photoUrl.replace("gateway.pinata.cloud", "ipfs.io")} 
            alt={item.title} 
            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '1rem' }} 
            />      
            <h3>{item.title}</h3>
            <p style={{ fontWeight: 'bold', color: '#334155' }}>Price: {ethers.utils.formatEther(item.price)} ETH</p>
            <button 
              onClick={() => handlePurchase(item.id, item.price)}
              style={{ width: '100%', backgroundColor: '#10B981', color: 'white', padding: '0.75rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Buy Securely (Escrow)
            </button>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Marketplace;
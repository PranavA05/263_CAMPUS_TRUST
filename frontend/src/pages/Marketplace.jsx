// src/pages/Marketplace.jsx
//Purpose: Displays active listings from the blockchain and allows users to purchase items securely by locking funds in the contract until the transaction is completed.

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getContract } from '../utils/web3Config';
import { getIPFSUrl } from '../utils/imageHelper';

const Marketplace = () => {
  const [items, setItems] = useState([]); //holds items from blockchain
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => { // reads contract for all items with state 0 (active listings) 
    setLoading(true);
    try {
      const contract = await getContract();
      const total = await contract.getTotalListings();
      
      let fetchedItems = [];
      for (let i = 1; i <= total; i++) {
        const item = await contract.getListing(i);
        if (item.state === 0) { // 0: listed only, 1: bought (locked), 2: completed
          fetchedItems.push(item);
        }
      }
      setItems(fetchedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (id, priceInWei) => {
    try {
      const contract = await getContract();
      const transaction = await contract.payForListing(id, { value: priceInWei });
      await transaction.wait();
      alert("Funds locked securely. Meet the seller!");
      fetchListings();
    } catch (error) {
      console.error("Purchase failed:", error);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', borderBottom: '2px solid #F1F5F9', paddingBottom: '1rem' }}>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: '#64748B' }}>
          <p>Scanning the blockchain for listings...</p>
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
          <p style={{ color: '#64748B', fontSize: '1.1rem' }}>No items for sale right now. Why not list one?</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '2.5rem' 
        }}>
          {items.map((item) => (
            <div 
              key={item.id.toString()} 
              style={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '16px', 
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                border: '1px solid #F1F5F9',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{ backgroundColor: '#F1F5F9', height: '220px', width: '100%', overflow: 'hidden' }}>
                <img 
                  src={getIPFSUrl(item.photoUrl)}
                  alt={item.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250?text=No+Image'; }}
                />
              </div>

              <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ color: '#1E293B', fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '700' }}>
                  {item.title}
                </h3>
                
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <span style={{ color: '#64748B', fontSize: '0.875rem' }}>Price</span>
                    <span style={{ fontWeight: '800', color: '#1D4ED8', fontSize: '1.1rem' }}>
                      {ethers.utils.formatEther(item.price)} ETH
                    </span>
                  </div>

                  <button 
                    onClick={() => handlePurchase(item.id, item.price)}
                    style={{ 
                      width: '100%', 
                      backgroundColor: '#10B981', 
                      color: 'white', 
                      padding: '0.8rem', 
                      border: 'none', 
                      borderRadius: '10px', 
                      cursor: 'pointer', 
                      fontWeight: '700',
                      fontSize: '1rem',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#10B981'}
                  >
                    Buy Securely
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
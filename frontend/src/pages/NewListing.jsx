// src/pages/NewListing.jsx
// PURPOSE: A form for sellers to upload an item, define the price, and write it to the blockchain.

import React, { useState } from 'react';
import { ethers } from 'ethers';
import { getContract } from '../utils/web3Config';
import { uploadImageToIPFS } from '../utils/storageConfig'; // Import the new utility

const NewListing = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // Added loading state

  const handlePostItem = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image for your listing.");
    
    try {
      setIsUploading(true); // Start loading

      // Step 1: Upload the file to web3.storage
      console.log("Uploading image to IPFS...");
      const photoUrl = await uploadImageToIPFS(file);
      console.log("Image uploaded successfully:", photoUrl);

      // Step 2: Write to the blockchain
      const contract = await getContract();
      
      // Convert user's price string into Wei
      const priceInWei = ethers.utils.parseEther(price);
      
      console.log("Requesting wallet signature...");
      const transaction = await contract.createListing(title, photoUrl, priceInWei);
      
      console.log("Waiting for network confirmation...");
      await transaction.wait(); 
      
      alert("Item successfully listed on CampusTrust!");
      
      // Reset form
      setTitle('');
      setPrice('');
      setFile(null);

    } catch (error) {
      console.error("Error creating listing:", error);
      alert("Failed to post listing. Check console for details.");
    } finally {
      setIsUploading(false); // Stop loading regardless of success/failure
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
      <h2 style={{ color: '#1D4ED8', marginBottom: '1.5rem' }}>Create a Safe Listing</h2>
      
      <form onSubmit={handlePostItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="text" 
          placeholder="Item Title (e.g., $200 Textbook)" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          style={{ padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
          required 
        />
        <input 
          type="number" 
          placeholder="Price in tBNB" 
          step="0.01"
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          style={{ padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
          required 
        />
        <input 
          type="file" 
          accept="image/*"
          onChange={(e) => setFile(e.target.files)} 
          style={{ padding: '0.75rem' }}
          required 
        />
        
        <button 
          type="submit" 
          disabled={isUploading}
          style={{ 
            backgroundColor: isUploading ? '#94A3B8' : '#1D4ED8', // Changes to grey when uploading
            color: 'white', 
            padding: '1rem', 
            border: 'none', 
            borderRadius: '8px', 
            fontSize: '1.1rem', 
            fontWeight: 'bold', 
            cursor: isUploading ? 'not-allowed' : 'pointer' 
          }}
        >
          {isUploading ? 'Uploading to IPFS & Processing...' : 'Post Item Securely'}
        </button>
      </form>
    </div>
  );
};

export default NewListing;
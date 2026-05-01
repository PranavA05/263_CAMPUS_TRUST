// src/pages/NewListing.jsx
//Purpose: Provides a form for users to create new listings by uploading an image to IPFS and then calling the smart contract to create a listing

import React, { useState } from 'react';
import { ethers } from 'ethers';
import { getContract } from '../utils/web3Config';
import { uploadImageToIPFS } from '../utils/storageConfig';

const NewListing = () => { // form state for title, price, file, and loading status
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePostItem = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select an image first!");
      return;
    }
    try {
      setIsUploading(true);
      console.log("Starting upload for:", file.name);
      const ipfsHash = await uploadImageToIPFS(file);// 1. Upload to IPFS
      console.log("Success! CID:", ipfsHash);
      const contract = await getContract();// 2. Blockchain Transaction
      const priceInWei = ethers.utils.parseEther(price);
      const tx = await contract.createListing(title, ipfsHash, priceInWei);
      await tx.wait(); // 3. Wait for confirmation
      alert("Listing Created Successfully!");
      setTitle(''); setPrice(''); setFile(null);
    } catch (error) { 
      console.error("Listing Error:", error);
      alert(error.message);
    } finally { // 4. Reset loading state
      setIsUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ color: '#1D4ED8', marginBottom: '1.5rem' }}>Create a Safe Listing</h2>
      
      <form onSubmit={handlePostItem} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <input 
          type="text" placeholder="Item Title" value={title} 
          onChange={(e) => setTitle(e.target.value)} required 
          style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #ddd' }}
        />
        <input 
          type="number" placeholder="Price in ETH" step="0.0001" value={price} 
          onChange={(e) => setPrice(e.target.value)} required 
          style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #ddd' }}
        />
        <div style={{ padding: '1rem', border: '2px dashed #cbd5e1', borderRadius: '8px' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#64748b' }}>Product Image:</p>
          <input 
            type="file" accept="image/*" 
            onChange={(e) => {
              // FIX: use files[0] to get a single File object, not the FileList
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
                console.log("File selected in UI:", e.target.files[0].name);
              }
            }} 
            required 
          />
          {file && (
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#10B981' }}>
              ✓ Selected: {file.name}
            </p>
          )}
        </div>
        <button 
          type="submit" disabled={isUploading}
          style={{ backgroundColor: isUploading ? '#94A3B8' : '#1D4ED8', color: 'white', padding: '1rem', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: isUploading ? 'not-allowed' : 'pointer' }}
        >
          {isUploading ? 'Processing...' : 'Post Item Securely'}
        </button>
      </form>
    </div>
  );
};

export default NewListing;
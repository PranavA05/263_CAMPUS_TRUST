// src/utils/web3Config.js
// PURPOSE: Establishes the ethers.js instance to interact with the deployed contract.

import { ethers } from "ethers";

// Replace this with your actual deployed contract address on BNB Testnet
export const CONTRACT_ADDRESS = "0x391Ff02d7ccBcB5b527eac3ADBf78E6908ABb698"; 

// A shortened version of your ABI for the required functions
export const CONTRACT_ABI = [
  "function createListing(string _title, string _photoUrl, uint256 _price) public",
  "function payForListing(uint256 _id) public payable",
  "function confirmReceipt(uint256 _id) public",
  "function getListing(uint256 _id) public view returns (tuple(uint256 id, address seller, address buyer, string title, string photoUrl, uint256 price, uint8 state))",
  "function getTotalListings() public view returns (uint256)"
];

export const getContract = async () => {
  if (!window.ethereum) throw new Error("No crypto wallet found");
  
  // Connect to MetaMask
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  
  // Return the contract instance connected to the user's wallet
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};
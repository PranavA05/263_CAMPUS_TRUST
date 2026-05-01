// src/context/WalletContext.jsx
// PURPOSE: Manages the global state for MetaMask wallet connection and user account.

import React, { createContext, useState, useEffect } from 'react';
export const WalletContext = createContext();
export const WalletProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) return alert("Please install MetaMask.");
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]); // FIX: store single address, not the whole array
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("Please install MetaMask.");
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(accounts[0]); // FIX: store single address, not the whole array
    } catch (error) {
      console.error(error);
      throw new Error("No ethereum object.");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    //update if the user switches accounts in MetaMask
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setCurrentAccount(accounts[0] || "");
      }); 
    }
  }, []);

  return (
    <WalletContext.Provider value={{ connectWallet, currentAccount }}>
      {children}
    </WalletContext.Provider>
  );
};
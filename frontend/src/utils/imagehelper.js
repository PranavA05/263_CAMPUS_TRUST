// src/utils/imageHelper.js
export const getIPFSUrl = (cid) => {
  if (!cid) return "https://via.placeholder.com/400?text=No+Image+Found";

  // Clean up if a full gateway URL was accidentally stored on-chain instead of a bare CID
  if (cid.includes('/ipfs/')) {
    cid = cid.split('/ipfs/')[1];
  }

  //cloudflare-ipfs.com was shut down in 2024 using dweb.link instead
  return `https://dweb.link/ipfs/${cid}`;
};
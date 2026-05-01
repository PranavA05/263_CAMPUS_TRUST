// src/utils/storageConfig.js
export const uploadImageToIPFS = async (file) => {
  if (!file) throw new Error("No file provided for upload");

  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
      },
      body: formData,
    });

    const resData = await res.json();
    
    // Construct the IPFS gateway URL using Pinata's gateway
    const imageUrl = `https://gateway.pinata.cloud/ipfs/${resData.IpfsHash}`;
    
    console.log("Stored file with CID:", resData.IpfsHash);
    return imageUrl;

  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    throw error;
  }
};
// src/utils/storageConfig.js
export const uploadImageToIPFS = async (file) => {
  if (!file) throw new Error("File object is missing!");
  const jwt = import.meta.env.VITE_PINATA_JWT;
  if (!jwt) throw new Error("Pinata JWT not found in .env file");
  const formData = new FormData();
  formData.append("file", file);
  try { // Upload file to Pinata
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt.trim()}`,
      },
      body: formData,
    });
    if (!res.ok) { 
      const errorData = await res.json();
      throw new Error(`Pinata Error: ${errorData.error.details || "Invalid Format"}`);
    }

    const data = await res.json();
    return data.IpfsHash; // Return the CID for blockchain storage
  } catch (error) {
    throw error;
  }
};
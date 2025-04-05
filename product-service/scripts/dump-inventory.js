const axios = require('axios');

const productIds = [
  "67dfb82a16a2922388832c10", "67dfba878a123027485727c2", "67dfba898a123027485727c4",
  "67dfba8a8a123027485727c6", "67dfba8b8a123027485727c8", "67dfba8c8a123027485727ca",
  "67dfba8d8a123027485727cc", "67dfbae78a123027485727ce", "67dfbae88a123027485727d0",
  "67dfbae98a123027485727d2", "67dfbaea8a123027485727d4", "67dfbaeb8a123027485727d6",
  "67dfbaed8a123027485727d8", "67dfbaee8a123027485727da", "67dfbaef8a123027485727dc",
  "67dfbaf18a123027485727df", "67dfbaf48a123027485727e3", "67dfbaf58a123027485727e5",
  "67dfbaf68a123027485727e7", "67dfbaf78a123027485727e9", "67dfbaf88a123027485727eb"
];

const userId = "67deeef1bd90688e0713b8eb";
const apiUrl = "http://localhost:3001/inventory";

function getRandomStock() {
  const stockValues = [0, 1, 2, 3, 4];
  return stockValues[Math.floor(Math.random() * stockValues.length)];
}

async function updateInventory() {
  for (const productId of productIds) {
    const payload = {
      productId: productId,
      stockCount: getRandomStock(),
      updatedBy: userId,
      lastUpdated: new Date().toISOString()
    };
    
    try {
      const response = await axios.post(apiUrl, payload, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json'
        }
      });
      console.log(`Updated inventory for product ${productId}:`, response.data);
    } catch (error) {
      console.error(`Failed to update inventory for product ${productId}:`, error.response?.data || error.message);
    }
  }
}

updateInventory();

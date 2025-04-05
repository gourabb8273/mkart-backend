const axios = require('axios');
const fs = require('fs');

const API_URL = 'http://localhost:3001/products';

async function fetchAllImageLinks() {
  try {
    const response = await axios.get(API_URL);
    const products = response.data;
    
    // Extract imageUrl from each product (ensuring it's defined)
    const imageLinks = products
      .map(product => product.imageUrl)
      .filter(link => !!link);
      
    fs.writeFileSync('imageLinks.txt', imageLinks.join('\n'));
    console.log(`Saved ${imageLinks.length} image links to imageLinks.txt`);
  } catch (error) {
    console.error('Error fetching products:', error.message);
  }
}

fetchAllImageLinks();

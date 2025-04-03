#!/bin/bash

API_URL="http://localhost:3001/"

PRODUCTS=(
  '{"name": "Men'\''s Cotton T-shirt", "description": "A comfortable and stylish cotton t-shirt for men.", "price": 19.99, "imageUrl": "https://cdn.pixabay.com/photo/2016/12/06/09/31/blank-1886008_640.png", "category": "Clothing", "featuredTags": ["Featured"], "gender": "Men", "sizes": ["S", "M", "L", "XL"], "style": "Casual"}'
  '{"name": "Women'\''s Summer Dress", "description": "A light and breezy summer dress.", "price": 29.99, "imageUrl": "https://cdn.pixabay.com/photo/2015/09/02/12/41/woman-918788_640.jpg", "category": "Clothing", "featuredTags": ["Featured"], "gender": "Women", "sizes": ["S", "M", "L"], "style": "Western"}'
  '{"name": "Leather Wallet", "description": "Premium leather wallet for men.", "price": 49.99, "imageUrl": "https://cdn.pixabay.com/photo/2016/12/23/13/47/purse-1921330_640.jpg", "category": "Accessories", "featuredTags": ["Featured"], "gender": "Men", "style": "Formal"}'
  '{"name": "Luxury Watch", "description": "An elegant wristwatch with a stainless steel strap.", "price": 199.99, "imageUrl": "https://cdn.pixabay.com/photo/2017/08/06/22/01/clock-2594085_640.jpg", "category": "Accessories", "featuredTags": ["Featured"], "gender": "Unisex", "style": "Casual"}'
  '{"name": "Running Shoes", "description": "High-performance running shoes with cushioned sole.", "price": 89.99, "imageUrl": "https://cdn.pixabay.com/photo/2017/07/31/11/44/shoes-2558371_640.jpg", "category": "Footwear", "featuredTags": ["Featured"], "gender": "Men", "sizes": ["M", "L", "XL"], "style": "Sports"}'
  '{"name": "Women'\''s High Heels", "description": "Stylish high heels for formal occasions.", "price": 79.99, "imageUrl": "https://cdn.pixabay.com/photo/2017/08/10/03/49/high-heels-2618089_640.jpg", "category": "Footwear", "featuredTags": ["Featured"], "gender": "Women", "sizes": ["S", "M", "L"], "style": "Formal"}'
  '{"name": "Men'\''s Leather Jacket", "description": "Classic brown leather jacket.", "price": 129.99, "imageUrl": "https://cdn.pixabay.com/photo/2016/11/23/00/53/leather-jacket-1853411_640.jpg", "category": "Clothing", "featuredTags": ["Popular"], "gender": "Men", "sizes": ["M", "L", "XL"], "style": "Casual"}'
  '{"name": "Women'\''s Handbag", "description": "Elegant leather handbag for daily use.", "price": 59.99, "imageUrl": "https://cdn.pixabay.com/photo/2017/09/25/13/12/handbag-2789924_640.jpg", "category": "Accessories", "featuredTags": ["Featured"], "gender": "Women", "style": "Casual"}'
  '{"name": "Sunglasses", "description": "Stylish sunglasses with UV protection.", "price": 24.99, "imageUrl": "https://cdn.pixabay.com/photo/2015/12/07/10/58/glasses-1086899_640.jpg", "category": "Eyewear", "featuredTags": ["Popular"], "gender": "Unisex", "style": "Casual"}'
  '{"name": "Denim Jeans", "description": "Slim-fit denim jeans for men.", "price": 39.99, "imageUrl": "https://cdn.pixabay.com/photo/2016/03/27/19/21/fashion-1284496_640.jpg", "category": "Clothing", "gender": "Men", "sizes": ["M", "L", "XL"], "style": "Casual"}'
  '{"name": "Gold Earrings", "description": "Elegant gold earrings for women.", "price": 199.99, "imageUrl": "https://cdn.pixabay.com/photo/2016/08/25/03/26/earrings-1614467_640.jpg", "category": "Jewelry", "featuredTags": ["Featured"], "gender": "Women", "style": "Formal"}'
  '{"name": "Smartwatch", "description": "Latest technology smartwatch with health tracking.", "price": 149.99, "imageUrl": "https://cdn.pixabay.com/photo/2017/12/28/21/36/smart-watch-3041923_640.jpg", "category": "Accessories", "featuredTags": ["Popular"], "gender": "Unisex", "style": "Tech"}'
  '{"name": "Men'\''s Formal Suit", "description": "Premium tailored suit for formal occasions.", "price": 299.99, "imageUrl": "https://cdn.pixabay.com/photo/2016/11/19/12/41/suit-1836445_640.jpg", "category": "Clothing", "featuredTags": ["Popular"], "gender": "Men", "sizes": ["M", "L", "XL"], "style": "Formal"}'
  '{"name": "Indian Saree", "description": "Traditional silk saree for special occasions.", "price": 249.99, "imageUrl": "https://cdn.pixabay.com/photo/2018/01/27/10/04/indian-woman-3117297_640.jpg", "category": "Clothing", "featuredTags": ["Featured"], "gender": "Women", "sizes": ["S", "M", "L"], "style": "Indian"}'
  '{"name": "Sports Cap", "description": "Adjustable sports cap with logo.", "price": 14.99, "imageUrl": "https://cdn.pixabay.com/photo/2017/10/07/22/37/baseball-cap-2825054_640.jpg", "category": "Accessories", "gender": "Unisex", "style": "Sports"}'
  '{"name": "Backpack", "description": "Durable backpack for daily commute.", "price": 69.99, "imageUrl": "https://cdn.pixabay.com/photo/2016/03/27/19/26/backpack-1284531_640.jpg", "category": "Accessories", "featuredTags": ["Popular"], "gender": "Unisex", "style": "Casual"}'
  '{"name": "Men'\''s Sneakers", "description": "Stylish sneakers with comfortable fit.", "price": 99.99, "imageUrl": "https://cdn.pixabay.com/photo/2017/08/06/21/15/shoes-2593925_640.jpg", "category": "Footwear", "gender": "Men", "sizes": ["M", "L", "XL"], "style": "Casual"}'
  '{"name": "Diamond Necklace", "description": "Luxury diamond necklace for women.", "price": 999.99, "imageUrl": "https://cdn.pixabay.com/photo/2017/06/15/17/37/diamonds-2406610_640.jpg", "category": "Jewelry", "featuredTags": ["Featured"], "gender": "Women", "style": "Formal"}'
)

for PRODUCT in "${PRODUCTS[@]}"; do
  echo "Sending product: $PRODUCT"
  curl -X POST "$API_URL" \
       -H "Content-Type: application/json" \
       -d "$PRODUCT"
  echo ""
  sleep 1
done

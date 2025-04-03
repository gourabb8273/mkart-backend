const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - imageUrl
 *         - category
 *         - gender
 *         - style
 *       properties:
 *         name:
 *           type: string
 *           example: "T-shirt"
 *         description:
 *           type: string
 *           example: "A stylish cotton t-shirt."
 *         price:
 *           type: number
 *           example: 19.99
 *         imageUrl:
 *           type: string
 *           example: "https://cdn.pixabay.com/photo/2016/12/06/09/31/blank-1886008_640.png"
 *         category:
 *           type: string
 *           enum: [Clothing, Accessories, Footwear, Beauty, Electronics]
 *           example: "Clothing"
 *         featuredTags:
 *           type: array
 *           items:
 *             type: string
 *             enum: [Featured, Popular, New Arrival, Best Seller]
 *           example: ["Featured"]
 *         gender:
 *           type: string
 *           enum: [Men, Women, Unisex]
 *           example: "Men"
 *         sizes:
 *           type: array
 *           items:
 *             type: string
 *             enum: [XS, S, M, L, XL, XXL]
 *           example: ["M", "L"]
 *         style:
 *           type: string
 *           enum: [Indian, Western, Fusion, Casual, Formal, Sports]
 *           example: "Casual"
 */

/**
 * @swagger
 * /:
 *   post:
 *     summary: Add a new product
 *     description: Stores a new product in the catalog.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product added!"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: 'Product added!', data: product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve products with optional filters and search
 *     description: Fetch all products or filter by category, gender, style, featured status, and search term.
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by product category (e.g., Clothing, Accessories, Footwear)
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *         description: Filter by gender (e.g., Men, Women, Unisex)
 *       - in: query
 *         name: style
 *         schema:
 *           type: string
 *         description: Filter by style (e.g., Casual, Formal, Indian, Western, Sports)
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter by featured products (true/false)
 *       - in: query
 *         name: popular
 *         schema:
 *           type: boolean
 *         description: Filter by popular products (true/false)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search products by name or description (case-insensitive)
 *     responses:
 *       200:
 *         description: List of filtered products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                   imageUrl:
 *                     type: string
 *                   category:
 *                     type: string
 *                   featuredTags:
 *                     type: array
 *                     items:
 *                       type: string
 *                   gender:
 *                     type: string
 *                   sizes:
 *                     type: array
 *                     items:
 *                       type: string
 *                   style:
 *                     type: string
 *                   stock:
 *                     type: number
 *                     description: Available stock count
 */

router.get('/', async (req, res) => {
  try {
    const { category, gender, style, featured, popular, search } = req.query;
    const atlasFilters = [];
    const matchFilters = {};

    // ========== FILTER CONSTRUCTION ========== //
    
    if (category) {
      atlasFilters.push({
        term: {
          path: "category",
          query: category
        }
      });
      matchFilters.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    if (gender) {
      atlasFilters.push({
        term: {
          path: "gender", 
          query: gender
        }
      });
      matchFilters.gender = { $regex: new RegExp(`^${gender}$`, "i") };
    }

    if (style) {
      atlasFilters.push({
        term: {
          path: "style",
          query: style
        }
      });
      matchFilters.style = { $regex: new RegExp(`^${style}$`, "i") };
    }

 
    const tagQueries = [];
    if (featured === 'true') {
      tagQueries.push({ term: { path: "featuredTags", query: "Featured" } });
    }
    if (popular === 'true') {
      tagQueries.push({ term: { path: "featuredTags", query: "Popular" } });
    }
    
    if (tagQueries.length > 0) {
      atlasFilters.push({
        compound: {
          should: tagQueries,
          minimumShouldMatch: 1
        }
      });
      matchFilters.featuredTags = { $in: [] };
      if (featured === 'true') matchFilters.featuredTags.$in.push("Featured");
      if (popular === 'true') matchFilters.featuredTags.$in.push("Popular");
    }

    // ========== PIPELINE CONSTRUCTION ========== //
    
    let pipeline = [];

    if (search) {
      pipeline.push({
        $search: {
          index: "default",
          compound: {
            must: [{
              text: {
                query: search,
                path: ["name", "description"],
                fuzzy: { maxEdits: 2 }
              }
            }],
            filter: atlasFilters.length > 0 ? atlasFilters : undefined
          }
        }
      });
    } 
    else if (Object.keys(matchFilters).length > 0) {
      pipeline.push({ $match: matchFilters });
    }


    pipeline.push(
      {
        $lookup: {
          from: "inventories",
          localField: "_id",
          foreignField: "productId",
          as: "inventoryData"
        }
      },
      {
        $addFields: {
          stock: { 
            $ifNull: [
              { $arrayElemAt: ["$inventoryData.stockCount", 0] }, 
              0
            ] 
          }
        }
      },
      { 
        $project: { 
          inventoryData: 0 
        } 
      }
    );

    // ========== EXECUTE QUERY ========== //
    
    const products = await Product.aggregate(pipeline);
    res.status(200).json(products);

  } catch (error) {
    console.error("API Error:", error.message);
    res.status(500).json({
      message: "Error fetching products",
      error: error.message
    });
  }
});

module.exports = router;
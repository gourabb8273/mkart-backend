const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

/**
 * @swagger
 * /search:
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
    const { category, gender, style, featured, popular, query } = req.query;
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

    if (query) {
      pipeline.push({
        $search: {
          index: "default",
          compound: {
            must: [{
              text: {
                query: query,
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
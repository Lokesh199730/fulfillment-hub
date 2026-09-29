const express = require("express");
const db = require("../database/db");

const router = express.Router();

router.get("/", (req, res) => {
    try {
        const products = db.prepare(`
            SELECT
                id,
                name,
                sku,
                variant,
                price
            FROM products
            ORDER BY name
        `).all();

        res.json(products);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch products"
        });
    }
});

module.exports = router;
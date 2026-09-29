const express = require("express");
const db = require("../database/db");

const router = express.Router();

router.get("/", (req, res) => {
    try {
        const inventory = db.prepare(`
            SELECT
                inventory.id,
                products.name AS product_name,
                products.sku,
                products.variant,
                warehouses.name AS warehouse_name,
                inventory.quantity
            FROM inventory
            JOIN products
                ON inventory.product_id = products.id
            JOIN warehouses
                ON inventory.warehouse_id = warehouses.id
            ORDER BY warehouses.name, products.name
        `).all();

        res.json(inventory);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch inventory"
        });
    }
});

module.exports = router;
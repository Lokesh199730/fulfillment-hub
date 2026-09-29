const express = require("express");
const db = require("../database/db");

const router = express.Router();

router.get("/", (req, res) => {
    try {
        const shipments = db.prepare(`
            SELECT
                shipments.id,
                orders.order_number,
                orders.customer_name,
                shipments.courier,
                shipments.tracking_number,
                shipments.status,
                shipments.pickup_time
            FROM shipments
            JOIN orders
                ON shipments.order_id = orders.id
            ORDER BY shipments.pickup_time DESC
        `).all();

        res.json(shipments);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch shipments"
        });
    }
});

module.exports = router;
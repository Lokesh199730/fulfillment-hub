const express = require("express");
const db = require("../database/db");

const router = express.Router();

router.get("/", (req, res) => {
    try {
        const orders = db.prepare(`
            SELECT
                id,
                order_number,
                customer_name,
                priority,
                status,
                deadline,
                created_at
            FROM orders
            ORDER BY
                CASE WHEN priority = 'HIGH' THEN 0 ELSE 1 END,
                deadline ASC
        `).all();

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch orders"
        });
    }
});
router.put("/:id/status", (req, res) => {

    try {

        const { status } = req.body;

        const allowedStatuses = [
            "RECEIVED",
            "PROCESSING",
            "PICKING",
            "PACKING",
            "STAGING",
            "SHIPPED",
            "DELAYED"
        ];

        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                error: "Invalid order status"
            });

        }

        const result = db.prepare(`
            UPDATE orders
            SET status = ?
            WHERE id = ?
        `).run(status, req.params.id);

        if (result.changes === 0) {

            return res.status(404).json({
                error: "Order not found"
            });

        }

        const updatedOrder = db.prepare(`
            SELECT
                id,
                order_number,
                customer_name,
                priority,
                status,
                deadline,
                created_at
            FROM orders
            WHERE id = ?
        `).get(req.params.id);

        res.json(updatedOrder);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to update order status"
        });

    }

});

module.exports = router;
const express = require("express");
const db = require("../database/db");

const router = express.Router();

router.get("/", (req, res) => {
    try {
        const totalOrders = db.prepare(`
            SELECT COUNT(*) AS count
            FROM orders
        `).get().count;

        const priorityOrders = db.prepare(`
            SELECT COUNT(*) AS count
            FROM orders
            WHERE priority = 'HIGH'
        `).get().count;

        const delayedOrders = db.prepare(`
            SELECT COUNT(*) AS count
            FROM orders
            WHERE status = 'DELAYED'
        `).get().count;

        const readyToShip = db.prepare(`
            SELECT COUNT(*) AS count
            FROM orders
            WHERE status = 'STAGING'
        `).get().count;

        const openIssues = db.prepare(`
            SELECT COUNT(*) AS count
            FROM issues
            WHERE status = 'OPEN'
        `).get().count;

        const lowStock = db.prepare(`
            SELECT COUNT(*) AS count
            FROM inventory
            WHERE quantity < 10
        `).get().count;

        res.json({
            totalOrders,
            priorityOrders,
            delayedOrders,
            readyToShip,
            openIssues,
            lowStock
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch dashboard summary"
        });
    }
});

module.exports = router;
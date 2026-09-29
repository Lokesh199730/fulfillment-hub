const express = require("express");
const db = require("../database/db");

const router = express.Router();

router.get("/", (req, res) => {
    try {
        const issues = db.prepare(`
            SELECT
                issues.id,
                orders.order_number,
                issues.title,
                issues.description,
                issues.priority,
                issues.status,
                issues.assigned_to,
                issues.created_at
            FROM issues
            LEFT JOIN orders
                ON issues.order_id = orders.id
            ORDER BY
                CASE
                    WHEN issues.priority = 'HIGH' THEN 0
                    WHEN issues.priority = 'MEDIUM' THEN 1
                    ELSE 2
                END,
                issues.created_at DESC
        `).all();

        res.json(issues);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch issues"
        });
    }
});

module.exports = router;
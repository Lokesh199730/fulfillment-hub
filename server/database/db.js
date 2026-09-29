const Database = require("better-sqlite3");

const db = new Database("database/fulfillment.db");

db.pragma("foreign_keys = ON");

console.log("Database connected successfully.");

module.exports = db;
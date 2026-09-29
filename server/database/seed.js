const db = require("./db");

// Clear existing demo data so this file can be safely run again.
db.exec(`
    DELETE FROM issues;
    DELETE FROM shipments;
    DELETE FROM order_items;
    DELETE FROM stock_transfers;
    DELETE FROM orders;
    DELETE FROM inventory;
    DELETE FROM products;
    DELETE FROM warehouses;
`);

// --------------------------------------------------
// 1. WAREHOUSES
// --------------------------------------------------

const insertWarehouse = db.prepare(`
    INSERT INTO warehouses (name)
    VALUES (?)
`);

const mainWarehouse = insertWarehouse.run("Main Warehouse").lastInsertRowid;
const secondaryWarehouse = insertWarehouse.run("Secondary Warehouse").lastInsertRowid;


// --------------------------------------------------
// 2. PRODUCTS
// --------------------------------------------------

const insertProduct = db.prepare(`
    INSERT INTO products (name, sku, variant, price)
    VALUES (?, ?, ?, ?)
`);

const products = [
    ["Classic T-Shirt", "TSH-001", "Black / Large", 799],
    ["Classic T-Shirt", "TSH-002", "White / Medium", 799],
    ["Running Shoes", "SHO-001", "Black / Size 9", 2499],
    ["Laptop Bag", "BAG-001", "15-inch / Black", 1499],
    ["Wireless Mouse", "MOU-001", "Black", 699],
    ["Mechanical Keyboard", "KEY-001", "RGB / Black", 2299],
    ["Phone Case", "CAS-001", "iPhone 15 / Clear", 499],
    ["Bluetooth Headphones", "HDP-001", "Black", 1999]
];

const productIds = {};

for (const product of products) {
    const result = insertProduct.run(...product);
    productIds[product[1]] = result.lastInsertRowid;
}


// --------------------------------------------------
// 3. INVENTORY
// --------------------------------------------------

const insertInventory = db.prepare(`
    INSERT INTO inventory (product_id, warehouse_id, quantity)
    VALUES (?, ?, ?)
`);

const inventoryData = [
    ["TSH-001", mainWarehouse, 18],
    ["TSH-001", secondaryWarehouse, 50],

    ["TSH-002", mainWarehouse, 12],
    ["TSH-002", secondaryWarehouse, 40],

    ["SHO-001", mainWarehouse, 3],
    ["SHO-001", secondaryWarehouse, 30],

    ["BAG-001", mainWarehouse, 5],
    ["BAG-001", secondaryWarehouse, 20],

    ["MOU-001", mainWarehouse, 25],
    ["MOU-001", secondaryWarehouse, 60],

    ["KEY-001", mainWarehouse, 8],
    ["KEY-001", secondaryWarehouse, 25],

    ["CAS-001", mainWarehouse, 40],
    ["CAS-001", secondaryWarehouse, 100],

    ["HDP-001", mainWarehouse, 10],
    ["HDP-001", secondaryWarehouse, 35]
];

for (const item of inventoryData) {
    insertInventory.run(
        productIds[item[0]],
        item[1],
        item[2]
    );
}


// --------------------------------------------------
// 4. ORDERS
// --------------------------------------------------

const insertOrder = db.prepare(`
    INSERT INTO orders
    (order_number, customer_name, priority, status, deadline)
    VALUES (?, ?, ?, ?, ?)
`);

const orders = [
    ["ORD-1001", "Rahul Kumar", "HIGH", "PICKING", "2026-09-29 14:00"],
    ["ORD-1002", "Priya Sharma", "NORMAL", "PACKING", "2026-09-29 16:00"],
    ["ORD-1003", "Arjun Reddy", "HIGH", "DELAYED", "2026-09-29 13:00"],
    ["ORD-1004", "Sneha Patel", "NORMAL", "PROCESSING", "2026-09-29 17:00"],
    ["ORD-1005", "Vikram Singh", "HIGH", "STAGING", "2026-09-29 15:30"],
    ["ORD-1006", "Ananya Rao", "NORMAL", "RECEIVED", "2026-09-29 18:00"],
    ["ORD-1007", "Karan Mehta", "NORMAL", "SHIPPED", "2026-09-29 12:00"],
    ["ORD-1008", "Neha Verma", "HIGH", "PICKING", "2026-09-29 14:30"],
    ["ORD-1009", "Rohan Das", "NORMAL", "PACKING", "2026-09-29 16:30"],
    ["ORD-1010", "Aisha Khan", "NORMAL", "SHIPPED", "2026-09-29 11:00"]
];

const orderIds = {};

for (const order of orders) {
    const result = insertOrder.run(...order);
    orderIds[order[0]] = result.lastInsertRowid;
}


// --------------------------------------------------
// 5. ORDER ITEMS
// --------------------------------------------------

const insertOrderItem = db.prepare(`
    INSERT INTO order_items
    (order_id, product_id, quantity)
    VALUES (?, ?, ?)
`);

const orderItems = [
    ["ORD-1001", "SHO-001", 1],
    ["ORD-1001", "TSH-001", 1],

    ["ORD-1002", "KEY-001", 1],
    ["ORD-1002", "MOU-001", 1],

    ["ORD-1003", "BAG-001", 1],
    ["ORD-1003", "HDP-001", 1],

    ["ORD-1004", "CAS-001", 2],

    ["ORD-1005", "HDP-001", 1],

    ["ORD-1006", "TSH-002", 2],

    ["ORD-1007", "KEY-001", 1],

    ["ORD-1008", "SHO-001", 1],

    ["ORD-1009", "BAG-001", 1],
    ["ORD-1009", "MOU-001", 1],

    ["ORD-1010", "CAS-001", 1]
];

for (const item of orderItems) {
    insertOrderItem.run(
        orderIds[item[0]],
        productIds[item[1]],
        item[2]
    );
}


// --------------------------------------------------
// 6. SHIPMENTS
// --------------------------------------------------

const insertShipment = db.prepare(`
    INSERT INTO shipments
    (order_id, courier, tracking_number, status, pickup_time)
    VALUES (?, ?, ?, ?, ?)
`);

insertShipment.run(
    orderIds["ORD-1005"],
    "Delhivery",
    "DLV1005001",
    "READY_FOR_PICKUP",
    "2026-09-29 15:30"
);

insertShipment.run(
    orderIds["ORD-1007"],
    "Blue Dart",
    "BD1007001",
    "SHIPPED",
    "2026-09-29 12:00"
);

insertShipment.run(
    orderIds["ORD-1010"],
    "Xpressbees",
    "XP1010001",
    "SHIPPED",
    "2026-09-29 11:00"
);


// --------------------------------------------------
// 7. STOCK TRANSFER
// --------------------------------------------------

const insertTransfer = db.prepare(`
    INSERT INTO stock_transfers
    (product_id, from_warehouse_id, to_warehouse_id, quantity, status)
    VALUES (?, ?, ?, ?, ?)
`);

insertTransfer.run(
    productIds["SHO-001"],
    secondaryWarehouse,
    mainWarehouse,
    5,
    "PENDING"
);


// --------------------------------------------------
// 8. ISSUES
// --------------------------------------------------

const insertIssue = db.prepare(`
    INSERT INTO issues
    (order_id, title, description, priority, status, assigned_to)
    VALUES (?, ?, ?, ?, ?, ?)
`);

insertIssue.run(
    orderIds["ORD-1003"],
    "Stock missing",
    "System shows stock available but warehouse team could not locate the item.",
    "HIGH",
    "OPEN",
    "Warehouse Team"
);

insertIssue.run(
    orderIds["ORD-1005"],
    "Courier pickup pending",
    "Packed box is ready but courier has not collected it yet.",
    "MEDIUM",
    "OPEN",
    "Shipping Team"
);

insertIssue.run(
    orderIds["ORD-1009"],
    "Variant verification required",
    "Confirm product variant before final packing.",
    "MEDIUM",
    "OPEN",
    "Packing Team"
);

console.log("Sample XYZ fulfillment data inserted successfully.");
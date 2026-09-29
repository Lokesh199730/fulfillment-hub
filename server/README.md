# Fulfillment Hub

A simple e-commerce order fulfillment management system built for the XYZ take-home assignment.

## Problem

XYZ's fulfillment process relies heavily on spreadsheets and shared folders. This can make it difficult to track order status, identify delays, monitor inventory, manage priority orders, and keep track of shipping and operational issues.

## Solution

Fulfillment Hub provides a centralized dashboard for monitoring and managing key warehouse fulfillment activities.

### Main Features

- Dashboard with fulfillment metrics
- Priority order queue
- Order status management
- Picking workflow
- Packing workflow
- Staging workflow
- Inventory monitoring
- Low-stock identification
- Shipping and courier tracking
- Issues and exceptions tracking
- Sample warehouse and order data

## Technology Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: SQLite
- Database library: better-sqlite3

## Project Structure

```text
fulfillment-hub/
└── server/
    ├── client/
    │   ├── index.html
    │   └── style.css
    ├── database/
    │   ├── db.js
    │   ├── init.js
    │   └── seed.js
    ├── routes/
    │   ├── dashboard.js
    │   ├── inventory.js
    │   ├── issues.js
    │   ├── orders.js
    │   ├── products.js
    │   └── shipments.js
    ├── package.json
    ├── package-lock.json
    └── server.js
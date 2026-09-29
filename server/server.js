const express = require("express");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "client")));

// Routes
const ordersRouter = require("./routes/orders");
const productsRouter = require("./routes/products");
const inventoryRouter = require("./routes/inventory");
const shipmentsRouter = require("./routes/shipments");
const issuesRouter = require("./routes/issues");
const dashboardRouter = require("./routes/dashboard");

app.use("/api/orders", ordersRouter);
app.use("/api/products", productsRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/shipments", shipmentsRouter);
app.use("/api/issues", issuesRouter);
app.use("/api/dashboard", dashboardRouter);

app.get("/", (req, res) => {
    res.json({
        message: "Fulfillment Hub API is running!"
    });
});

app.listen(PORT, () => {
    console.log(`Fulfillment Hub server running at http://localhost:${PORT}`);
});
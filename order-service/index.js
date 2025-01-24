const express = require("express");
const app = express();
const port = 3000;

app.get("/order", (req, res) => {
    res.json({ message: "Hello from Order Service1234!" });
});

app.listen(port, () => {
    console.log(`Order Service running on port ${port}`);
});

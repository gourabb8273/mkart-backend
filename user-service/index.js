const express = require("express");
const app = express();
const port = 3000;

app.get("/user", (req, res) => {
    res.json({ message: "Hello from User Service................gourab.!" });
});

app.listen(port, () => {
    console.log(`User Service running on port ${port}`);
});

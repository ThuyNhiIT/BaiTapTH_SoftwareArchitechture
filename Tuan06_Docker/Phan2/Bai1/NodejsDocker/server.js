const express = require("express");
const app = express();
const PORT = 3000;

console.log("Server script is starting..."); 

app.get("/", (req, res) => {
  res.send("Hello, Docker!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

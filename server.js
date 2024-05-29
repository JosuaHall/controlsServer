const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// Proxy route
app.get("/api/endpoint", async (req, res) => {
  try {
    const response = await axios.get(`http://${process.env.ser_nr}/`, {
      auth: {
        username: "pvserver",
        password: "pvwr",
      },
      headers: {
        Authorization: req.header("Authorization"), // Pass authorization header if present
        Accept: req.header("Accept"), // Pass accept header if present
        // Add any other headers you want to pass to the API server
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error proxying request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});

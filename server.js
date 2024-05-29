const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dns = require("dns");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Define CORS options
const corsOptions = {
  origin: "https://hallshauscontrols.netlify.app",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Proxy route
app.get("/api/endpoint", async (req, res) => {
  try {
    const targetUrl = `http://${process.env.ser_nr}`;
    console.log(`Target URL: ${targetUrl}`);
    console.log(`Environment Variable ser_nr: ${process.env.ser_nr}`);

    // DNS Lookup to verify resolution
    dns.lookup(process.env.ser_nr, (err, address, family) => {
      if (err) {
        console.error("DNS lookup failed:", err);
      } else {
        console.log("DNS lookup result:", address, family);
      }
    });

    const response = await axios.get(targetUrl, {
      auth: {
        username: "pvserver",
        password: "pvwr",
      },
      headers: {
        Authorization: req.header("Authorization"),
        Accept: req.header("Accept"),
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error proxying request:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      console.error("No response received:", error.request);
      res
        .status(500)
        .json({ error: "No response received from target server" });
    } else {
      console.error("Error setting up request:", error.message);
      res.status(500).json({ error: "Error setting up request" });
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});

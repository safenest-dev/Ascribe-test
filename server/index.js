// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
require("dotenv").config();

const app = express();
 
app.use(express.json());
app.use(cors());
 
let db;

async function setupDatabase() {
  // Open SQLite database (creates file if it doesn't exist)
  db = await open({
    filename: path.join(__dirname, "urlshortener.db"),
    driver: sqlite3.Database,
  });

  // Create URLs table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      originalUrl TEXT NOT NULL,
      shortCode TEXT UNIQUE NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      clicks INTEGER DEFAULT 0
    )
  `);

  // Create index on shortCode for faster lookups
  await db.exec("CREATE INDEX IF NOT EXISTS idx_shortCode ON urls (shortCode)");

  console.log("SQLite database setup complete");
}
 
function generateShortCode(length = 5) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Create URL route
app.post("/api/shorten", async (req, res) => {
  const { url } = req.body;
  console.log(url);
  if (!url) {
    return res.status(400).json({ error: "Please provide a URL" });
  }

  try {
    const existingUrl = await db.get(
      "SELECT * FROM urls WHERE originalUrl = ?",
      url
    );
    if (existingUrl) {
      return res.json(existingUrl);
    }
    let shortCode = generateShortCode();
    let codeExists = true;

    while (codeExists) {
      const existing = await db.get(
        "SELECT 1 FROM urls WHERE shortCode = ?",
        shortCode
      );
      if (!existing) {
        codeExists = false;
      } else {
        shortCode = generateShortCode();
      }
    }

    const result = await db.run(
      "INSERT INTO urls (originalUrl, shortCode) VALUES (?, ?)",
      [url, shortCode]
    );

    const urlDoc = {
      id: result.lastID,
      originalUrl: url,
      shortCode: shortCode,
      clicks: 0,
    };

    return res.json(urlDoc);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Redirect route
app.get("/:code", async (req, res) => {
  console.log("Redirect route hit for code:", req.params.code);
  try {
    const url = await db.get(
      "SELECT * FROM urls WHERE shortCode = ?",
      req.params.code
    );

    if (!url) {
      console.log("URL not found, redirecting to /not-found");
      return res.redirect(
        `${req.headers.origin || "http://localhost:5173"}/not-found`
      );
    }

    await db.run("UPDATE urls SET clicks = clicks + 1 WHERE id = ?", url.id);

    console.log(`Redirecting to: ${url.originalUrl}`);
    return res.redirect(url.originalUrl);
  } catch (err) {
    console.error("Error in redirect route:", err);
    // Redirect to not-found on server errors as well
    return res.redirect(
      `${req.headers.origin || "http://localhost:5173"}/not-found`
    );
  }
});

// Get URL info
app.get("/api/url/:code", async (req, res) => {
  try {
    const url = await db.get(
      "SELECT * FROM urls WHERE shortCode = ?",
      req.params.code
    );

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    return res.json(url);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Initialize the server
async function startServer() {
  await setupDatabase();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Start the server
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

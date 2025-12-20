const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const dbPath = process.env.DB_PATH || "./data/calcflow.db";
const db = new Database(dbPath);

const app = express();

// Allow requests from other apps (later: frontend)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Calculate endpoint
app.post("/calculate", (req, res) => {
  const { a, b, operator } = req.body;

  const numA = Number(a);
  const numB = Number(b);

  // Validate numbers
  if (!Number.isFinite(numA) || !Number.isFinite(numB)) {
    return res.status(400).json({ error: "a and b must be valid numbers" });
  }

  // Validate operator
  if (!["+", "-", "*", "/"].includes(operator)) {
    return res.status(400).json({ error: "operator must be one of + - * /" });
  }

  // Division by zero
  if (operator === "/" && numB === 0) {
    return res.status(400).json({ error: "cannot divide by zero" });
  }

  // Compute
  let result;
  switch (operator) {
    case "+":
      result = numA + numB;
      break;
    case "-":
      result = numA - numB;
      break;
    case "*":
      result = numA * numB;
      break;
    case "/":
      result = numA / numB;
      break;
  }

  db.prepare(`
    INSERT INTO calculations (a, b, operator, result, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    numA,
    numB,
    operator,
    result,
    Date.now()
  );

  // Return JSON
  res.json({ result });
});

app.get("/history", (req, res) => {
  const rows = db.prepare(`
    SELECT id, a, b, operator, result, created_at
    FROM calculations
    ORDER BY id DESC
    LIMIT 50
  `).all();

  res.json({ history: rows });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
  });
}

module.exports = app;
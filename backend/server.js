const express = require("express");
const cors = require("cors");

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

  // Return JSON
  return res.json({ result });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
  console.log("Try: http://localhost:3000/health");
});
import { useState, useEffect } from "react";
import "./App.css";

type HistoryItem = {
  a: number;
  b: number;
  operator: "+" | "-" | "*" | "/";
  result: number;
};

function App() {
  const [valueA, setValueA] = useState("");
  const [valueB, setValueB] = useState("");
  const [result, setResult] = useState<string | number>("");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/history")
      .then((res) => res.json())
      .then((data) => setHistory(data.history))
      .catch(() => {
        console.error("Failed to fetch history from server.");
      });
  }, []);

  const handleOperation = async (operator: "+" | "-" | "*" | "/") => {
    const numA = parseFloat(valueA);
    const numB = parseFloat(valueB);

    if (isNaN(numA) || isNaN(numB)) {
      setResult("Please enter two valid numbers.");
      return;
    }

    setResult("Calculating...");

    try {
      const response = await fetch("http://localhost:3000/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ a: numA, b: numB, operator }),
      });

      const data = await response.json();

      if (!response.ok) {
        setResult(data.error || "Server error");
        return;
      }

      setResult(data.result);

      const historyRes = await fetch("http://localhost:3000/history");
      const historyData = await historyRes.json();
      setHistory(historyData.history);
    } catch {
      setResult("Network error: backend server unreachable.");
    }
  };

  return (
  <div className="app-container">
    <div className="calc-card">
      <h2 className="title">CalcFlow Calculator</h2>

      <input
        className="calc-input"
        type="number"
        value={valueA}
        onChange={(e) => setValueA(e.target.value)}
        placeholder="Enter first number"
      />

      <input
        className="calc-input"
        type="number"
        value={valueB}
        onChange={(e) => setValueB(e.target.value)}
        placeholder="Enter second number"
      />

      <div className="operator-group">
        {["+", "-", "*", "/"].map((op) => (
          <button
            key={op}
            className="operator-button"
            onClick={() => handleOperation(op as any)}
          >
            {op === "*" ? "×" : op === "/" ? "÷" : op}
          </button>
        ))}
      </div>

      <div className="result">
        Result: <span className="result-value">{result !== null ? result : "—"}</span>
      </div>

      <hr className="divider" />

      <h3 className="history-title">History</h3>

      {history.length === 0 && <p className="history-empty">No calculations yet.</p>}

      <ul className="history-list">
        {history.map((item, index) => (
          <li key={index} className="history-item">
            {item.a} {item.operator} {item.b} = {item.result}
          </li>
        ))}
      </ul>
    </div>
  </div>
);
}

export default App;

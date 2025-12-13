import { useState } from "react";

type HistoryItem = {
  a: number;
  b: number;
  operator: "+" | "-" | "*" | "/";
  result: number;
}

function App() {
  const [valueA, setValueA] = useState("");
  const [valueB, setValueB] = useState("");
  const [result, setResult] = useState<string | number>("");
  const [history, setHistory] = useState<HistoryItem[]>([]);

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          a: numA,
          b: numB,
          operator: operator,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setResult(data.error || "Server error");
        return;
      }

      const resultFromServer = data.result;

      setResult(resultFromServer);

  const newItem: HistoryItem = {
    a: numA,
    b: numB,
    operator,
    result: resultFromServer,
  };

  // Here you can add code to save newItem to history if needed
  setHistory((prev) => [newItem, ...prev]);
    } catch (error) {
      setResult("Network error: backend server unreachable.");
    }
};

  return (
    <div
      style={{
        width: "600px",
        margin: "0 auto",
        textAlign: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <h2>CalcFlow Calculator</h2>

      <input
        style={{ width: "100%", marginBottom: "10px" }}
        type="number"
        value={valueA}
        onChange={(e) => setValueA(e.target.value)}
        placeholder="Enter first number"
      />

      <input
        style={{ width: "100%", marginBottom: "10px" }}
        type="number"
        value={valueB}
        onChange={(e) => setValueB(e.target.value)}
        placeholder="Enter second number"
      />

      <div style={{ marginBottom: "24px", display: "flex", gap: "16px", justifyContent: "center" }}>
        <button
          style={{
            minWidth: "64px",
            padding: "0.6em 1.2em",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#b30000",
            backgroundColor: "#ffd54f",
            border: "1px solid rgba(0,0,0,0.12)",
          }}
          onClick={() => handleOperation("+")}
        >
          +
        </button>

        <button
          style={{
            minWidth: "64px",
            padding: "0.6em 1.2em",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#b30000",
            backgroundColor: "#ffd54f",
            border: "1px solid rgba(0,0,0,0.12)",
          }}
          onClick={() => handleOperation("-")}
        >
          -
        </button>

        <button
          style={{
            minWidth: "64px",
            padding: "0.6em 1.2em",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#b30000",
            backgroundColor: "#ffd54f",
            border: "1px solid rgba(0,0,0,0.12)",
          }}
          onClick={() => handleOperation("*")}
        >
          ×
        </button>

        <button
          style={{
            minWidth: "64px",
            padding: "0.6em 1.2em",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#b30000",
            backgroundColor: "#ffd54f",
            border: "1px solid rgba(0,0,0,0.12)",
          }}
          onClick={() => handleOperation("/")}
        >
          ÷
        </button>
      </div>

      <h3>Result: {result !== null ? result : "—"}</h3>

      <hr />

      <h3>History</h3>

      {history.length === 0 && <p>No calculations yet.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {history.map((item, index) => (
          <li key={index} style={{ marginBottom: "6px" }}>
            {item.a} {item.operator} {item.b} = {item.result}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
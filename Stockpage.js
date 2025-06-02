import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

const StockPage = () => {
  const [stocks, setStocks] = useState({});
  const [selectedTicker, setSelectedTicker] = useState("");
  const [minutes, setMinutes] = useState(5);
  const [stockData, setStockData] = useState([]);
  const [error, setError] = useState(null);

  // Signup form states
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupMessage, setSignupMessage] = useState("");

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await fetch("/api/stocks");
        if (!res.ok) throw new Error(`Error fetching stocks: ${res.status}`);
        const data = await res.json();
        setStocks(data.stocks || {});
        const firstTicker = Object.values(data.stocks)[0] || "";
        setSelectedTicker(firstTicker);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchStocks();
  }, []);

  useEffect(() => {
    if (!selectedTicker) return;

    const fetchStockData = async () => {
      try {
        setError(null);
        const url = `/api/stocks/${selectedTicker}?minutes=${minutes}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error fetching stock data: ${res.status}`);
        const data = await res.json();

        if (Array.isArray(data.stock)) {
          setStockData(data.stock);
        } else {
          setStockData(
            data.stock
              ? [{ timestamp: new Date().toLocaleTimeString(), price: data.stock.price }]
              : []
          );
        }
      } catch (err) {
        setError(err.message);
        setStockData([]);
      }
    };

    fetchStockData();
  }, [selectedTicker, minutes]);

  const average =
    stockData.length > 0
      ? (
          stockData.reduce((sum, p) => sum + p.price, 0) / stockData.length
        ).toFixed(2)
      : 0;

 
  return (
    <div style={{ padding: "24px", maxWidth: "700px", margin: "auto" }}>
      <h2>Stocks</h2>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <label>
        Select Stock:{" "}
        <select
          value={selectedTicker}
          onChange={(e) => setSelectedTicker(e.target.value)}
          disabled={!Object.keys(stocks).length}
        >
          {Object.entries(stocks).map(([name, ticker]) => (
            <option key={ticker} value={ticker}>
              {name} ({ticker})
            </option>
          ))}
        </select>
      </label>

      <br />
      <br />

      <label>
        Minutes:{" "}
        <select
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
        >
          {[5, 10, 15, 30, 50].map((m) => (
            <option key={m} value={m}>
              Last {m} min
            </option>
          ))}
        </select>
      </label>

      <br />
      <br />

      {stockData.length > 0 ? (
        <>
          <LineChart width={700} height={350} data={stockData}>
            <CartesianGrid stroke="#eee" />
            <XAxis dataKey="timestamp" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#8884d8" />
            <ReferenceLine y={parseFloat(average)} stroke="red" label="Avg" />
          </LineChart>
          <p style={{ marginTop: "16px", fontWeight: "bold" }}>
            🔴 Avg Price: ₹{average}
          </p>
        </>
      ) : (
        <p>No data to show</p>
      )}


    </div>
  );
};

export default StockPage;

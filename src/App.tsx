import  { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Form from "./form";
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1"];

export default function ProductListing() {
  const [products, setProducts] = useState([]);
  const [colorFilter, setColorFilter] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("");
  const [error, setError] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://react-charts-backend-production.up.railway.app/api/products")
      .then((res) => {
        const parsedData = res.data.map((item: any) => ({
          ...item,
          data: item.data ? JSON.parse(item.data) : null,
        }));
        setProducts(parsedData);
        setLoading(false);
        setError(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);
  const getProducts = async () => {
    setLoading(true);
    axios
      .get("https://react-charts-backend-production.up.railway.app/api/products")
      .then((res) => {
        const parsedData = res.data.map((item: any) => ({
          ...item,
          data: item.data ? JSON.parse(item.data) : null,
        }));
        setProducts(parsedData);
        setLoading(false);
        setOpenForm(false);
        setError(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };
  const filteredProducts = products.filter((product: any) => {
    const color =
      product.data?.color ||
      product.data?.Color ||
      product.data?.["Strap Colour"];
    const capacity =
      product.data?.capacity ||
      product.data?.Capacity ||
      product.data?.["capacity GB"];

    return (
      (!colorFilter || color === colorFilter) &&
      (!capacityFilter || capacity === capacityFilter)
    );
  });

  const colorCounts: any = {};
  const capacityCounts: any = {};
  products.forEach((p: any) => {
    const color = p.data?.color || p.data?.Color || p.data?.["Strap Colour"];
    const capacity =
      p.data?.capacity || p.data?.Capacity || p.data?.["capacity GB"];
    if (color) colorCounts[color] = (colorCounts[color] || 0) + 1;
    if (capacity)
      capacityCounts[capacity] = (capacityCounts[capacity] || 0) + 1;
  });

  const colorChartData = Object.entries(colorCounts).map(([key, value]) => ({
    name: key,
    value,
  }));
  const capacityChartData = Object.entries(capacityCounts).map(
    ([key, value]) => ({ name: key, value })
  );
  const handleOpenForm = () => {
    setOpenForm(true);
  };
  return (
    <div style={{ padding: "24px", width: "100%", margin: "0 auto" }}>
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "24px",
        }}
      >
        Product Listing with Charts
      </h1>
      <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
        <select
          onChange={(e) => setColorFilter(e.target.value)}
          style={{
            border: "1px solid #ccc",
            padding: "8px",
            borderRadius: "4px",
          }}
        >
          <option value="">Filter by Color</option>
          {Object.keys(colorCounts).map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setCapacityFilter(e.target.value)}
          style={{
            border: "1px solid #ccc",
            padding: "8px",
            borderRadius: "4px",
          }}
        >
          <option value="">Filter by Capacity</option>
          {Object.keys(capacityCounts).map((cap) => (
            <option key={cap} value={cap}>
              {cap}
            </option>
          ))}
        </select>
        <button onClick={handleOpenForm}>Add Product</button>
      </div>
      {openForm && <Form getProducts={getProducts}/>}
      {loading ? (
        "loading"
      ) : error ?"error fetching data": (
        <div>
          {filteredProducts.map((p: any) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ddd",
                padding: "16px",
                marginBottom: "16px",
                borderRadius: "8px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              }}
            >
              <h2 style={{ fontWeight: "600", fontSize: "18px" }}>{p.name}</h2>
              {p.data ? (
                <div style={{ fontSize: "14px", color: "#555" }}>
                  {Object.entries(p.data).map(([key, val]: any) => (
                    <div key={key}>
                      <strong>{key}:</strong> {val}
                    </div>
                  ))}
                </div>
              ) : (
                <p>Data: N/A</p>
              )}
            </div>
          ))}

          <div
            style={{
              marginTop: "32px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Product Distribution by Color
              </h2>
              <BarChart width={350} height={250} data={colorChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </div>

            <div>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Product Distribution by Capacity
              </h2>
              <PieChart width={350} height={250}>
                <Pie
                  data={capacityChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#82ca9d"
                  label
                >
                  {capacityChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}-${entry}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

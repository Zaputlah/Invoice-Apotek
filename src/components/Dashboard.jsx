import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const Dashboard = ({ barangList, pasienList, setCurrentMenu }) => {
  const data = [
    { name: "Obat", value: barangList.length },
    { name: "Pasien", value: pasienList.length },
  ];

  const COLORS = ["#0088FE", "#00C49F"];

  const cardStyle = {
    flex: 1,
    padding: "1.5rem",
    borderRadius: "12px",
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
    transition: "transform 0.2s",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        background: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: "2rem", color: "#333" }}>
        Dashboard Apotek/Klinik
      </h1>

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <div
          style={cardStyle}
          onClick={() => setCurrentMenu("barang")}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-5px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        >
          <h3>Total Barang</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#0088FE" }}>
            {barangList.length}
          </p>
        </div>
        <div
          style={cardStyle}
          onClick={() => setCurrentMenu("pasien")}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-5px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        >
          <h3>Total Pasien</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#00C49F" }}>
            {pasienList.length}
          </p>
        </div>
      </div>

      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <h3 style={{ marginBottom: "1rem" }}>Distribusi Barang & Pasien</h3>
        <PieChart width={400} height={300}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label={(entry) => `${entry.name}: ${entry.value}`}
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </div>
    </div>
  );
};

export default Dashboard;

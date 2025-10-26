import React from "react";
import "../css/Sidebar.css";

const Sidebar = ({ currentMenu, setCurrentMenu }) => {
  return (
    <div className="sidebar">
      <h2>Apotek Neosoft</h2>
      <ul>
        <li
          className={currentMenu === "dashboard" ? "active" : ""}
          onClick={() => setCurrentMenu("dashboard")}
        >
          🏠 Dashboard
        </li>
        <li
          className={currentMenu === "barang" ? "active" : ""}
          onClick={() => setCurrentMenu("barang")}
        >
          💊 Data Barang
        </li>
        <li
          className={currentMenu === "pasien" ? "active" : ""}
          onClick={() => setCurrentMenu("pasien")}
        >
          🧑‍⚕️ Data Pasien
        </li>
        <li
          className={currentMenu === "transaksi" ? "active" : ""}
          onClick={() => setCurrentMenu("transaksi")}
        >
          💳 Transaksi
        </li>
        <li
          className={currentMenu === "history" ? "active" : ""}
          onClick={() => setCurrentMenu("history")}
        >
          📜 History Transaksi
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import DataBarang from "./components/DataBarang";
import DataPasien from "./components/DataPasien";
import MenuTransaksi from "./components/MenuTransaksi";
import TransactionHistory from "./components/TransactionHistory"; // komponen baru
import "./App.css";

const getInitialData = (key, initialValue) => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : initialValue;
  } catch (error) {
    console.error("Error reading localStorage key:", key, error);
    return initialValue;
  }
};

function App() {
  const [currentMenu, setCurrentMenu] = useState("dashboard");

  const [barangList, setBarangList] = useState(() =>
    getInitialData("barangList", [
      { id: "P-23030001", nama: "Obat Sakit Kepala", harga: 15000 },
      { id: "P-23030002", nama: "Plester Luka", harga: 5000 },
    ])
  );

  const [pasienList, setPasienList] = useState(() =>
    getInitialData("pasienList", [
      { id: "EM-23030001", nama: "Tuti", telepon: "0899222232" },
      { id: "EM-23030002", nama: "Budi Santoso", telepon: "08123456789" },
    ])
  );

  // State untuk history transaksi
  const [historyList, setHistoryList] = useState(() =>
    getInitialData("transactionHistory", [])
  );

  useEffect(() => {
    localStorage.setItem("barangList", JSON.stringify(barangList));
  }, [barangList]);

  useEffect(() => {
    localStorage.setItem("pasienList", JSON.stringify(pasienList));
  }, [pasienList]);

  useEffect(() => {
    localStorage.setItem("transactionHistory", JSON.stringify(historyList));
  }, [historyList]);

  const addBarang = (newBarang) => {
    setBarangList([
      ...barangList,
      { ...newBarang, tanggal: new Date().toISOString() },
    ]);
  };

  const addPasien = (newPasien) => {
    setPasienList([
      ...pasienList,
      { ...newPasien, tanggal: new Date().toISOString() },
    ]);
  };

  // Fungsi untuk menambahkan transaksi ke history
  const addTransaction = (transaction) => {
    setHistoryList([transaction, ...historyList]);
  };

  const renderContent = () => {
    switch (currentMenu) {
      case "dashboard":
        return (
          <Dashboard
            barangList={barangList}
            pasienList={pasienList}
            setCurrentMenu={setCurrentMenu}
          />
        );
      case "barang":
        return <DataBarang barangList={barangList} addBarang={addBarang} />;
      case "pasien":
        return <DataPasien pasienList={pasienList} addPasien={addPasien} />;
      case "transaksi":
        return (
          <MenuTransaksi
            barangList={barangList}
            pasienList={pasienList}
            addTransaction={addTransaction} // kirim ke MenuTransaksi
          />
        );
      case "history":
        return <TransactionHistory transactionHistory={historyList} />;
      default:
        return (
          <Dashboard
            barangList={barangList}
            pasienList={pasienList}
            setCurrentMenu={setCurrentMenu}
          />
        );
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentMenu={currentMenu} setCurrentMenu={setCurrentMenu} />
      <div className="main-content">{renderContent()}</div>
    </div>
  );
}

export default App;

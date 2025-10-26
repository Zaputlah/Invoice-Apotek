import React, { useState, useMemo, useRef } from "react";
import "../css/MenuTransaksi.css";

const initialTransaction = {
  noInvoice: "INV-" + new Date().toISOString().slice(0, 10).replace(/-/g, ""),
  tanggal: new Date().toLocaleDateString("id-ID"),
  idPasien: "",
  namaPasien: "",
  items: [],
};

const MenuTransaksi = ({ barangList, pasienList }) => {
  const [transaction, setTransaction] = useState(initialTransaction);
  const [newItemId, setNewItemId] = useState("");
  const [newItemQty, setNewItemQty] = useState(1);

  const strukRef = useRef();

  // Cari pasien berdasarkan nama
  const handlePasienChange = (e) => {
    const namaInput = e.target.value.toLowerCase();
    const foundPasien = pasienList.find(
      (p) => p.nama.toLowerCase() === namaInput
    );

    setTransaction((prev) => {
      const resetItems =
        prev.namaPasien && prev.namaPasien !== namaInput ? [] : prev.items;

      return {
        ...prev,
        idPasien: foundPasien ? foundPasien.id : "",
        namaPasien: foundPasien ? foundPasien.nama : e.target.value,
        items: resetItems,
      };
    });
  };

  const handleAddItem = () => {
    const itemToAdd = barangList.find((b) => b.id === newItemId);

    if (itemToAdd && newItemQty > 0) {
      const existingItemIndex = transaction.items.findIndex(
        (item) => item.id === newItemId
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...transaction.items];
        updatedItems[existingItemIndex].jumlah += newItemQty;
        setTransaction((prev) => ({ ...prev, items: updatedItems }));
      } else {
        const newItem = {
          id: itemToAdd.id,
          nama: itemToAdd.nama,
          harga: itemToAdd.harga,
          jumlah: newItemQty,
        };
        setTransaction((prev) => ({
          ...prev,
          items: [...prev.items, newItem],
        }));
      }

      setNewItemId("");
      setNewItemQty(1);
    }
  };

  const totalPembelian = useMemo(() => {
    return transaction.items.reduce(
      (sum, item) => sum + item.harga * item.jumlah,
      0
    );
  }, [transaction.items]);

  const handleSaveAndNew = () => {
    if (!transaction.idPasien) {
      alert("Silakan pilih pasien yang valid!");
      return;
    }

    // Ambil daftar transaksi yang sudah ada di localStorage
    const storedTransactions = localStorage.getItem("transactionList");
    const transactions = storedTransactions
      ? JSON.parse(storedTransactions)
      : [];

    // Tambahkan transaksi baru
    const newTransaction = { ...transaction };
    const updatedTransactions = [...transactions, newTransaction];

    // Simpan kembali ke localStorage
    localStorage.setItem(
      "transactionList",
      JSON.stringify(updatedTransactions)
    );

    alert(
      `Invoice ${
        transaction.noInvoice
      } berhasil disimpan!\nTotal: Rp ${totalPembelian.toLocaleString("id-ID")}`
    );

    // Reset transaksi baru
    setTransaction({
      ...initialTransaction,
      noInvoice:
        "INV-" + new Date().toISOString().slice(0, 10).replace(/-/g, ""),
      tanggal: new Date().toLocaleDateString("id-ID"),
    });
  };

  const handleCetakStruk = () => {
    const printContent = strukRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <div className="data-container">
      <h3>MENU TRANSAKSI</h3>

      <div className="grid-info">
        <div>
          No Invoice : <strong>{transaction.noInvoice}</strong>
        </div>
        <div>
          Tanggal : <strong>{transaction.tanggal}</strong>
        </div>
        <div>
          Nama Pasien :
          <input
            type="text"
            placeholder="Cari Nama Pasien"
            value={transaction.namaPasien}
            onChange={handlePasienChange}
            list="pasien-names"
          />
          <datalist id="pasien-names">
            {pasienList.map((p) => (
              <option key={p.id} value={p.nama} />
            ))}
          </datalist>
        </div>
        <div>
          ID Pasien : <strong>{transaction.idPasien || "-"}</strong>
        </div>
      </div>

      <div className="add-item">
        <select
          value={newItemId}
          onChange={(e) => setNewItemId(e.target.value)}
          className="input-select"
        >
          <option value="">-- Pilih Barang --</option>
          {barangList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nama} (Rp {item.harga.toLocaleString("id-ID")})
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          value={newItemQty}
          onChange={(e) => setNewItemQty(parseInt(e.target.value))}
          className="input-number"
        />

        <button onClick={handleAddItem} className="btn-add">
          Tambahkan Item
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item yang dibeli</th>
            <th>Harga Satuan</th>
            <th>Jumlah</th>
            <th>SUBTOTAL</th>
          </tr>
        </thead>
        <tbody>
          {transaction.items.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                Belum ada item ditambahkan.
              </td>
            </tr>
          ) : (
            transaction.items.map((item, index) => (
              <tr key={index}>
                <td>{item.nama}</td>
                <td>Rp {item.harga.toLocaleString("id-ID")}</td>
                <td>{item.jumlah}</td>
                <td>Rp {(item.harga * item.jumlah).toLocaleString("id-ID")}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="total">
        TOTAL: Rp {totalPembelian.toLocaleString("id-ID")}
      </div>

      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <button
          onClick={handleSaveAndNew}
          disabled={transaction.items.length === 0}
          className="btn-save"
        >
          Simpan & Transaksi Baru
        </button>

        <button
          onClick={handleCetakStruk}
          disabled={transaction.items.length === 0} // disable kalau belum ada item
          style={{
            background:
              transaction.items.length === 0
                ? "linear-gradient(90deg, #a0c4ff, #b2f2bb)" // warna disabled
                : "linear-gradient(90deg, #00C49F, #0088FE)", // warna aktif
            color: transaction.items.length === 0 ? "#666" : "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: transaction.items.length === 0 ? "not-allowed" : "pointer",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          🖨️ Cetak Struk
        </button>
      </div>

      {/* STRUK */}
      <div ref={strukRef} style={{ display: "none" }}>
        <div
          style={{
            width: "300px",
            padding: "10px",
            fontFamily: "monospace",
            fontSize: "12px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <h2 style={{ margin: 0 }}>APOTEK NEOSOFT</h2>
            <p style={{ margin: 0, fontSize: "10px" }}>
              Jl. Pisang Keju No.42, Jakarta Selatan
            </p>
            <hr />
          </div>

          <p>No Invoice: {transaction.noInvoice}</p>
          <p>Tanggal: {transaction.tanggal}</p>
          <p>Pasien: {transaction.namaPasien}</p>
          <hr />

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Item</th>
                <th style={{ textAlign: "right" }}>Harga</th>
                <th style={{ textAlign: "center" }}>Qty</th>
                <th style={{ textAlign: "right" }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {transaction.items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.nama}</td>
                  <td style={{ textAlign: "right" }}>
                    Rp {item.harga.toLocaleString("id-ID")}
                  </td>
                  <td style={{ textAlign: "center" }}>{item.jumlah}</td>
                  <td style={{ textAlign: "right" }}>
                    Rp {(item.harga * item.jumlah).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr />
          <div style={{ textAlign: "right", fontWeight: "bold" }}>
            Total: Rp {totalPembelian.toLocaleString("id-ID")}
          </div>
          <hr />
          <p style={{ textAlign: "center", marginTop: "10px" }}>
            Terima kasih atas kunjungannya!
          </p>
        </div>
      </div>
    </div>
  );
};

export default MenuTransaksi;

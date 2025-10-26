import React, { useState, useRef } from "react";
import "../css/DataBarang.css";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DataBarang = ({ barangList, addBarang }) => {
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const tableRef = useRef();

  const handleAdd = () => {
    const namaRegex = /^[A-Za-z\s]+$/;

    if (!nama || !harga) {
      alert("Nama dan harga barang wajib diisi!");
      return;
    }

    if (!namaRegex.test(nama)) {
      alert("Nama barang hanya boleh huruf dan spasi!");
      return;
    }

    if (isNaN(harga) || parseFloat(harga) <= 0) {
      alert("Harga harus berupa angka lebih dari 0!");
      return;
    }

    // ===== Validasi nama barang unik =====
    const namaExist = barangList.some(
      (item) => item.nama.toLowerCase() === nama.trim().toLowerCase()
    );
    if (namaExist) {
      alert("Nama barang sudah ada, gunakan nama lain!");
      return;
    }

    const newIdNum = barangList.length + 1;
    const newId = `P-2303${String(newIdNum).padStart(4, "0")}`;
    const newBarang = { id: newId, nama, harga: parseFloat(harga) };
    addBarang(newBarang);
    setNama("");
    setHarga("");
  };

  const exportExcel = () => {
    const today = new Date().toLocaleDateString("id-ID");
    const wsData = [
      [`Daftar Harga Barang - Tanggal: ${today}`],
      [],
      ["No", "ID", "Nama", "Harga"],
      ...barangList.map((item, idx) => [
        idx + 1,
        item.id,
        item.nama,
        item.harga,
      ]),
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];

    ["A3", "B3", "C3", "D3"].forEach((cell) => {
      if (!ws[cell]) return;
      ws[cell].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "2980B9" } },
        alignment: { horizontal: "center" },
      };
    });

    ws["!cols"] = [{ wpx: 40 }, { wpx: 80 }, { wpx: 200 }, { wpx: 100 }];

    XLSX.utils.book_append_sheet(wb, ws, "Barang");
    XLSX.writeFile(wb, `Daftar_Barang_${today}.xlsx`);
  };

  const exportWord = () => {
    const today = new Date().toLocaleDateString("id-ID");
    let html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office'
            xmlns:w='urn:schemas-microsoft-com:office:word'
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset="utf-8"><title>Daftar Barang</title></head><body>
      <h2 style="text-align:center;">Daftar Harga Barang</h2>
      <p style="text-align:center;">Tanggal: ${today}</p>
      <table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%; font-family: Arial;">
        <tr style="background-color:#2980b9; color:white; text-align:center;">
          <th>No</th><th>ID</th><th>Nama Barang</th><th>Harga (Rp)</th>
        </tr>`;

    barangList.forEach((item, idx) => {
      html += `
        <tr>
          <td style="text-align:center;">${idx + 1}</td>
          <td style="text-align:center;">${item.id}</td>
          <td>${item.nama}</td>
          <td style="text-align:right;">${item.harga.toLocaleString(
            "id-ID"
          )}</td>
        </tr>`;
    });

    html += `</table></body></html>`;
    const blob = new Blob([html], { type: "application/msword" });
    saveAs(blob, `Daftar_Barang_${today}.doc`);
  };

  return (
    <div className="data-container">
      <h3>DAFTAR HARGA BARANG</h3>

      <div className="input-group">
        <input
          type="text"
          placeholder="Nama Barang"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />
        <input
          type="number"
          placeholder="Harga"
          value={harga}
          onChange={(e) => setHarga(e.target.value)}
        />
        <button onClick={handleAdd}>Tambah</button>
      </div>

      <table ref={tableRef}>
        <thead>
          <tr>
            <th>No</th>
            <th>ID</th>
            <th>Nama</th>
            <th>Harga</th>
          </tr>
        </thead>
        <tbody>
          {barangList.map((item, idx) => (
            <tr key={item.id}>
              <td>{idx + 1}</td>
              <td>{item.id}</td>
              <td>{item.nama}</td>
              <td>Rp {item.harga.toLocaleString("id-ID")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: "15px",
          fontSize: "small",
          backgroundColor: "#f9f9f9",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <p>
          <strong>Keterangan Kode Barang:</strong>
        </p>
        <ul style={{ margin: 0, paddingLeft: "20px" }}>
          <li>
            <strong>P</strong> : Kode tetap untuk produk/barang
          </li>
          <li>
            <strong>23</strong> : Tahun pembuatan data (contoh: 2023)
          </li>
          <li>
            <strong>03</strong> : Bulan pembuatan data (contoh: Maret)
          </li>
          <li>
            <strong>0001</strong> : Nomor urut/increment barang
          </li>
        </ul>
        <p style={{ marginTop: "5px", fontStyle: "italic" }}>
          Contoh: P-23030001 artinya barang pertama dibuat pada Maret 2023.
        </p>
      </div>

      <div className="buttons-export">
        <button
          className="btn-excel"
          onClick={exportExcel}
          disabled={barangList.length === 0}
        >
          Export Excel
        </button>
        <button
          className="btn-word"
          onClick={exportWord}
          disabled={barangList.length === 0}
        >
          Export Word
        </button>
      </div>
    </div>
  );
};

export default DataBarang;

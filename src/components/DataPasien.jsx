import React, { useState } from "react";
import "../css/DataPasien.css";

const DataPasien = ({ pasienList, addPasien }) => {
  const [nama, setNama] = useState("");
  const [telepon, setTelepon] = useState("");

  const handleAdd = () => {
    const namaRegex = /^[A-Za-z\s]+$/;
    const teleponRegex = /^0\d{8,12}$/; // angka, diawali 0, total 9-13 digit

    if (!nama || !telepon) {
      alert("Nama dan Telepon wajib diisi!");
      return;
    }

    if (!namaRegex.test(nama)) {
      alert("Nama pasien hanya boleh huruf dan spasi!");
      return;
    }

    if (!teleponRegex.test(telepon)) {
      alert("Telepon harus diawali 0, hanya angka, dan panjang 9-13 digit!");
      return;
    }

    // ===== Validasi nama unik =====
    const namaExist = pasienList.some(
      (p) => p.nama.toLowerCase() === nama.trim().toLowerCase()
    );
    if (namaExist) {
      alert("Nama pasien sudah ada, gunakan nama lain!");
      return;
    }

    // ===== Validasi telepon unik =====
    const teleponExist = pasienList.some((p) => p.telepon === telepon.trim());
    if (teleponExist) {
      alert("Nomor telepon sudah terdaftar, gunakan nomor lain!");
      return;
    }

    const newIdNum = pasienList.length + 1;
    const newId = `EM-2303${String(newIdNum).padStart(4, "0")}`;

    const newPasien = {
      id: newId,
      nama: nama.trim(),
      telepon: telepon.trim(),
    };

    addPasien(newPasien);
    setNama("");
    setTelepon("");
  };

  return (
    <div className="data-container">
      <h3>DATA PASIEN</h3>

      <div className="input-group">
        <input
          type="text"
          placeholder="Nama Pasien"
          value={nama}
          onChange={(e) => {
            const value = e.target.value;
            // Hanya huruf dan spasi
            if (/^[A-Za-z\s]*$/.test(value)) setNama(value);
          }}
        />
        <input
          type="text"
          placeholder="Telepon"
          value={telepon}
          onChange={(e) => {
            const value = e.target.value;
            // Hanya angka
            if (/^\d*$/.test(value)) setTelepon(value);
          }}
        />
        <button onClick={handleAdd}>Tambah</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama Pasien</th>
            <th>Telepon</th>
          </tr>
        </thead>
        <tbody>
          {pasienList.map((pasien) => (
            <tr key={pasien.id}>
              <td>{pasien.id}</td>
              <td>{pasien.nama}</td>
              <td>{pasien.telepon}</td>
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
          <strong>Keterangan Kode Pasien:</strong>
        </p>
        <ul style={{ margin: 0, paddingLeft: "20px" }}>
          <li>
            <strong>EM</strong> : Kode tetap untuk pasien
          </li>
          <li>
            <strong>23</strong> : Tahun pembuatan data (contoh: 2023)
          </li>
          <li>
            <strong>03</strong> : Bulan pembuatan data (contoh: Maret)
          </li>
          <li>
            <strong>0001</strong> : Nomor urut/increment pasien
          </li>
        </ul>
        <p style={{ marginTop: "5px", fontStyle: "italic" }}>
          Contoh: EM-23030001 artinya pasien pertama dibuat pada Maret 2023.
        </p>
      </div>
    </div>
  );
};

export default DataPasien;

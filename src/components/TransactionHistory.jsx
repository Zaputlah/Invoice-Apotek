import React, { useState, useEffect } from "react";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  // Ambil data transaksi dari localStorage saat komponen mount
  useEffect(() => {
    const storedTransactions = localStorage.getItem("transactionList");
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  return (
    <div className="data-container">
      <h3>RIWAYAT TRANSAKSI</h3>

      {transactions.length === 0 ? (
        <p>Tidak ada transaksi yang tersimpan.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>No Invoice</th>
              <th>Tanggal</th>
              <th>Nama Pasien</th>
              <th>Items</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((trx, idx) => (
              <tr key={idx}>
                <td>{trx.noInvoice}</td>
                <td>{trx.tanggal}</td>
                <td>{trx.namaPasien}</td>
                <td>
                  <ul style={{ paddingLeft: "20px", margin: 0 }}>
                    {trx.items.map((item, i) => (
                      <li key={i}>
                        {item.nama} x {item.jumlah} = Rp{" "}
                        {(item.harga * item.jumlah).toLocaleString("id-ID")}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  Rp{" "}
                  {trx.items
                    .reduce((sum, item) => sum + item.harga * item.jumlah, 0)
                    .toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionHistory;

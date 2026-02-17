import { useEffect, useState } from "react";
import API from "../services/api";

const InvoiceHistoryPage = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    API.get("/api/invoices").then(res => setInvoices(res.data));
  }, []);

  return (
    <div className="container mt-4">
      <h3>Invoice History</h3>

      {invoices.map(inv => (
        <div key={inv.ID} className="card mb-2 p-3">
          <h5>Total: {inv.Total}</h5>
          <p>Payment: {inv.PaymentMethod}</p>
          <p>Discount: {inv.Discount}</p>
        </div>
      ))}
    </div>
  );
};

export default InvoiceHistoryPage;

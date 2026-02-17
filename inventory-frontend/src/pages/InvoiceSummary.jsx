import jsPDF from "jspdf";

export default function InvoiceSummary({ invoice }) {
  if (!invoice) return <h4>No invoice available</h4>;

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("INVOICE", 20, 20);
    doc.text(`Invoice ID: ${invoice.id}`, 20, 30);
    doc.text(`Date: ${invoice.date}`, 20, 40);
    doc.text(`Payment: ${invoice.paymentMethod}`, 20, 50);

    let y = 60;

    invoice.items.forEach((item) => {
      doc.text(
        `${item.name} - Qty: ${item.quantity} - Rp ${item.subtotal}`,
        20,
        y
      );
      y += 10;
    });

    doc.text(`Total: Rp ${invoice.total}`, 20, y + 10);
    doc.text(`Discount: ${invoice.discount}%`, 20, y + 20);
    doc.text(`Grand Total: Rp ${invoice.grandTotal}`, 20, y + 30);

    doc.save(`invoice-${invoice.id}.pdf`);
  };

  return (
    <div>
      <h3>Invoice Summary</h3>

      <p><strong>Invoice ID:</strong> {invoice.id}</p>
      <p><strong>Date:</strong> {invoice.date}</p>
      <p><strong>Payment:</strong> {invoice.paymentMethod}</p>

      <h4>Grand Total: Rp {invoice.grandTotal.toLocaleString()}</h4>

      <button
        className="btn btn-success mt-3"
        onClick={exportPDF}
      >
        Export PDF
      </button>
    </div>
  );
}

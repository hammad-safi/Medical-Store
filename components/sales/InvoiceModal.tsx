"use client";

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  invoice: any;
}

export default function InvoiceModal({
  open,
  onClose,
  invoice,
}: InvoiceModalProps) {
  if (!open || !invoice) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-3">
        <h2 className="text-xl font-bold">Invoice</h2>

        <p><b>Invoice #:</b> {invoice.invoiceNumber}</p>
        <p><b>Product:</b> {invoice.productName}</p>
        <p><b>Quantity:</b> {invoice.quantity}</p>
        <p><b>Discount:</b> {invoice.discount}%</p>
        <p><b>Total:</b> {invoice.total}</p>
        <p><b>Payment:</b> {invoice.paymentMethod}</p>

        <div className="flex gap-2 pt-4">
          <button
            onClick={() => window.print()}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
          >
            Print
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

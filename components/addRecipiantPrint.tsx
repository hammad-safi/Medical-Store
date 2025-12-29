"use client";
import { useRef } from "react";
import { Printer, X } from "lucide-react";

interface ReceiptProps {
  sale: any;
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  onClose?: () => void;
}

export function ReceiptPrint({ sale, onClose }: ReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = receiptRef.current;
    const printWindow = window.open('', '_blank');
    
    if (printWindow && printContent) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Receipt ${sale.invoiceNumber}</title>
            <style>
              @media print {
                @page { margin: 0; size: auto; }
                body { margin: 0.5cm; font-family: 'Courier New', monospace; }
                .receipt { width: 80mm; margin: 0 auto; }
                .no-print { display: none !important; }
              }
              body { font-family: 'Courier New', monospace; font-size: 12px; }
              .receipt { width: 80mm; margin: 0 auto; padding: 10px; }
              .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
              .store-name { font-size: 18px; font-weight: bold; }
              .store-address { font-size: 10px; margin: 5px 0; }
              .invoice-number { margin: 5px 0; }
              .date-time { margin: 5px 0; }
              .line { border-bottom: 1px dashed #000; margin: 10px 0; }
              .items-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
              .items-table th { text-align: left; padding: 3px 0; border-bottom: 1px solid #000; }
              .items-table td { padding: 3px 0; }
              .total-row { border-top: 2px solid #000; margin-top: 10px; padding-top: 5px; }
              .total-amount { font-size: 14px; font-weight: bold; }
              .thank-you { text-align: center; margin-top: 20px; font-style: italic; }
              .footer { text-align: center; margin-top: 20px; font-size: 10px; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Print Receipt</h2>
          <p className="text-gray-600">Review and print customer receipt</p>
        </div>

        <div ref={receiptRef} className="border border-gray-300 p-4">
          <div className="text-center mb-4">
            <div className="text-lg font-bold">MEDIMART PHARMACY</div>
            <div className="text-xs text-gray-600">123 Medical Street, Health City</div>
            <div className="text-xs text-gray-600">Phone: +1 (555) 123-4567</div>
            <div className="text-xs text-gray-600">GSTIN: 29ABCDE1234F1Z5</div>
          </div>

          <div className="border-t border-b border-gray-300 py-2 my-2">
            <div className="flex justify-between text-sm">
              <span>Invoice:</span>
              <span className="font-bold">#{sale.invoiceNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Date:</span>
              <span>{new Date(sale.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Time:</span>
              <span>{new Date(sale.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
          </div>

          <div className="my-2">
            <div className="text-sm">
              <span className="font-semibold">Customer:</span> {sale.customerName}
            </div>
            {sale.customerPhone && (
              <div className="text-sm">
                <span className="font-semibold">Phone:</span> {sale.customerPhone}
              </div>
            )}
          </div>

          <table className="w-full text-sm my-3">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-1">Item</th>
                <th className="text-right py-1">Qty</th>
                <th className="text-right py-1">Price</th>
                <th className="text-right py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-1">{sale.productName}</td>
                <td className="text-right py-1">{sale.quantity}</td>
                <td className="text-right py-1">${sale.unitPrice.toFixed(2)}</td>
                <td className="text-right py-1">${sale.totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div className="border-t border-gray-300 pt-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${sale.totalAmount.toFixed(2)}</span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between text-sm text-red-600">
                <span>Discount ({sale.discount}%):</span>
                <span>-${((sale.totalAmount * sale.discount) / 100).toFixed(2)}</span>
              </div>
            )}
            {sale.tax > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Tax ({sale.tax}%):</span>
                <span>+${(((sale.totalAmount - (sale.totalAmount * sale.discount) / 100) * sale.tax) / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-300">
              <span>TOTAL:</span>
              <span>${sale.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center mt-4 pt-2 border-t border-gray-300">
            <div className="text-sm">
              Payment: <span className="font-semibold">{sale.paymentMethod}</span>
            </div>
            <div className="text-sm text-green-600 font-semibold">Status: PAID</div>
          </div>

          <div className="text-center mt-4 text-xs text-gray-500">
            Thank you for your purchase!<br />
            Please visit again
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <Printer size={20} />
            Print Receipt
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
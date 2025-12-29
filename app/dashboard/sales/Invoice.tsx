"use client";
import { useRef } from "react";
import { Printer, X, Building, Phone, Mail } from "lucide-react";

interface InvoiceProps {
  sale: any;
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  onClose?: () => void;
}

export function Invoice({ sale, companyName = "MediMart Pharmacy", companyAddress = "123 Medical Street, Health City", companyPhone = "+1 (555) 123-4567", companyEmail = "info@medimart.com", onClose }: InvoiceProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    const printWindow = window.open('', '_blank');
    
    if (printWindow && printContent) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${sale.invoiceNumber}</title>
            <style>
              @media print {
                @page { margin: 0; size: auto; }
                body { margin: 1.6cm; }
                .no-print { display: none !important; }
              }
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              .invoice-container { max-width: 800px; margin: 0 auto; border: 1px solid #000; padding: 30px; }
              .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
              .company-info h1 { margin: 0; color: #1e40af; }
              .invoice-info { text-align: right; }
              .invoice-number { font-size: 24px; font-weight: bold; color: #000; }
              .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; }
              .section-title { border-bottom: 2px solid #000; padding-bottom: 10px; margin: 20px 0; font-weight: bold; }
              .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              .table th { background: #f3f4f6; padding: 12px; text-align: left; border-bottom: 2px solid #000; }
              .table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
              .totals { margin-top: 30px; text-align: right; }
              .totals-row { display: flex; justify-content: space-between; max-width: 300px; margin-left: auto; }
              .grand-total { font-size: 20px; font-weight: bold; color: #000; margin-top: 10px; }
              .footer { margin-top: 50px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
              .signature { margin-top: 50px; text-align: center; }
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header with print button */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center no-print">
          <div className="flex items-center gap-2">
            <Building className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold">Print Invoice</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Printer size={18} />
              Print
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Invoice Content */}
        <div ref={printRef} className="p-8">
          <div className="invoice-container">
            {/* Company Header */}
            <div className="header">
              <div className="company-info">
                <h1 className="text-3xl font-bold text-blue-600">{companyName}</h1>
                <div className="mt-2 space-y-1 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Building size={16} />
                    {companyAddress}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    {companyPhone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    {companyEmail}
                  </div>
                </div>
              </div>
              
              <div className="invoice-info">
                <div className="text-sm text-gray-500">INVOICE</div>
                <div className="invoice-number">#{sale.invoiceNumber}</div>
                <div className="mt-2 text-gray-600">
                  Date: {new Date(sale.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Customer & Seller Info */}
            <div className="details-grid">
              <div>
                <h3 className="section-title">BILL TO</h3>
                <div className="font-bold text-lg">{sale.customerName}</div>
                {sale.customerPhone && (
                  <div className="text-gray-600">Phone: {sale.customerPhone}</div>
                )}
              </div>
              
              <div>
                <h3 className="section-title">SOLD BY</h3>
                <div className="font-bold">{sale.sellerId?.fullName || "System"}</div>
                <div className="text-gray-600">{sale.sellerId?.email || ""}</div>
              </div>
            </div>

            {/* Items Table */}
            <h3 className="section-title">INVOICE DETAILS</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-semibold">{sale.productName}</td>
                  <td>{sale.quantity}</td>
                  <td>${sale.unitPrice.toFixed(2)}</td>
                  <td>${sale.totalAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            {/* Calculation Summary */}
            <div className="totals">
              <div className="space-y-2">
                <div className="totals-row">
                  <span>Subtotal:</span>
                  <span>${sale.totalAmount.toFixed(2)}</span>
                </div>
                {sale.discount > 0 && (
                  <div className="totals-row">
                    <span>Discount ({sale.discount}%):</span>
                    <span className="text-red-600">-${((sale.totalAmount * sale.discount) / 100).toFixed(2)}</span>
                  </div>
                )}
                {sale.tax > 0 && (
                  <div className="totals-row">
                    <span>Tax ({sale.tax}%):</span>
                    <span className="text-green-600">+${(((sale.totalAmount - (sale.totalAmount * sale.discount) / 100) * sale.tax) / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="totals-row grand-total">
                  <span>GRAND TOTAL:</span>
                  <span>${sale.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold">Payment Information</div>
              <div className="mt-2">
                <span className="text-gray-600">Method: </span>
                <span className="font-bold">{sale.paymentMethod}</span>
              </div>
              <div className="mt-1">
                <span className="text-gray-600">Status: </span>
                <span className="font-bold text-green-600">PAID</span>
              </div>
            </div>

            {/* Footer */}
            <div className="footer">
              <p>Thank you for your business!</p>
              <p className="mt-2 text-sm">This is a computer generated invoice and does not require a signature.</p>
            </div>

            {/* Signature (optional) */}
            <div className="signature">
              <div className="border-t border-black w-48 mx-auto mt-16 pt-4">
                <div>Authorized Signature</div>
              </div>
            </div>
          </div>
        </div>

        {/* Print button at bottom (for mobile) */}
        <div className="sticky bottom-0 bg-white border-t p-4 no-print">
          <button
            onClick={handlePrint}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <Printer size={20} />
            Print Invoice
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="w-full mt-2 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";

interface SaleFormModalProps {
  open: boolean;
  onClose: () => void;
  product: any;
  onSubmit: (data: any) => void;
}

export default function SaleFormModal({
  open,
  onClose,
  product,
  onSubmit,
}: SaleFormModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") handleSubmit();
    };
    if (open) window.addEventListener("keydown", handleEnter);
    return () => window.removeEventListener("keydown", handleEnter);
  }, [open]);

  const handleSubmit = () => {
    onSubmit({
      productId: product._id,
      quantity,
      discount,
      paymentMethod,
    });
    onClose();
  };

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold">Sell Product</h2>

        <div>
          <label className="text-sm font-medium">Product</label>
          <p className="font-semibold">{product.name}</p>
        </div>

        <input
          type="number"
          min={1}
          placeholder="Quantity"
          className="w-full border rounded-lg p-2"
          value={quantity}
          onChange={(e) => setQuantity(+e.target.value)}
        />

        <input
          type="number"
          min={0}
          placeholder="Discount (%)"
          className="w-full border rounded-lg p-2"
          value={discount}
          onChange={(e) => setDiscount(+e.target.value)}
        />

        <select
          className="w-full border rounded-lg p-2"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="Credit">Credit</option>
        </select>

        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg"
          >
            Complete Sale
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>

        <p className="text-xs text-center text-gray-500">
          Press <b>Enter</b> to complete sale
        </p>
      </div>
    </div>
  );
}

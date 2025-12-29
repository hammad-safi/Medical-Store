"use client";
import { X } from "lucide-react";

export default function Toast({ message, type, onClose }) {
  return (
    <div
      className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-up z-50 ${
        type === "success"
          ? "bg-green-500"
          : type === "error"
          ? "bg-red-500"
          : "bg-blue-500"
      } text-white`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80">
        <X size={16} />
      </button>
    </div>
  );
}

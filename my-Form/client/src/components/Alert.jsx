import React from "react";

export default function Alert({ type = "error", message, onClose }) {
  if (!message) return null;

  const isError = type === "error";

  return (
    <div
      role="alert"
      className={`p-4 rounded-lg text-sm border flex items-start justify-between gap-2 ${
        isError
          ? "bg-red-50 border-red-200 text-red-800"
          : "bg-emerald-50 border-emerald-200 text-emerald-800"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="font-semibold">{isError ? "Error:" : "Success:"}</span>
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss alert"
          className="text-slate-500 hover:text-slate-800 font-bold px-1 rounded focus:outline-none focus:ring-1 focus:ring-slate-400"
        >
          ×
        </button>
      )}
    </div>
  );
}

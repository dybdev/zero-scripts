"use client";

import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import { ToastContainer } from "react-toastify";

export function ToastProvider() {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={2800}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      pauseOnHover
      draggable
      theme="dark"
      toastClassName="zero-toast"
      icon={({ type }) => {
        if (type === "success") {
          return <CircleCheck size={21} strokeWidth={2.2} />;
        }
        if (type === "error" || type === "warning") {
          return <CircleAlert size={21} strokeWidth={2.2} />;
        }
        return <Info size={21} strokeWidth={2.2} />;
      }}
      closeButton={({ closeToast }) => (
        <button
          type="button"
          className="zero-toast-close"
          onClick={closeToast}
          aria-label="Dismiss notification"
        >
          <X size={15} strokeWidth={2.2} />
        </button>
      )}
    />
  );
}

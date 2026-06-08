import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ConfirmModalProps {
  open: boolean;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  message = "Are you sure you want to Logout?",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div className="confirm-overlay" onClick={onCancel}>
      <div
        className="confirm-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Confirm logout"
      >
        {/* Question icon circle */}
        <div className="confirm-icon-circle">
          <span className="confirm-icon-glyph">?</span>
        </div>

        {/* Message */}
        <p className="confirm-message">{message}</p>

        {/* Action buttons */}
        <div className="confirm-actions">
          <button className="confirm-btn confirm-btn-no" onClick={onCancel}>
            NO
          </button>
          <button className="confirm-btn confirm-btn-yes" onClick={onConfirm}>
            YES
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

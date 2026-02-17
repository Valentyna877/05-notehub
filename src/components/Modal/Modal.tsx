import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

export interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = ""; 
      
    };
  }, []);

  useEffect(() => {
    const modalEl = modalRef.current;
    if (!modalEl) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        const focusableElements = modalEl.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const focusArray = Array.from(focusableElements);
        if (focusArray.length === 0) return;

        const first = focusArray[0];
        const last = focusArray[focusArray.length - 1];
        const active = document.activeElement;

        if (e.shiftKey) {
          if (active === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    
    modalEl.addEventListener("keydown", handleTab);
    return () => modalEl.removeEventListener("keydown", handleTab);
  }, []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal} ref={modalRef} tabIndex={-1}>
        {children}
      </div>
    </div>,
    document.body
  );
}
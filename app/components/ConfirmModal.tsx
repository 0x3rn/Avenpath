"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info, Trash2, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl z-10 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              disabled={isLoading}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4 mb-6">
              {/* Icon Header */}
              <div
                className={`p-3 rounded-2xl shrink-0 ${
                  variant === "danger"
                    ? "bg-red-500/10 text-red-500 border border-red-500/20"
                    : variant === "warning"
                    ? "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                    : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                }`}
              >
                {variant === "danger" ? (
                  <Trash2 className="w-6 h-6" />
                ) : variant === "warning" ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <Info className="w-6 h-6" />
                )}
              </div>

              <div>
                <h3 className="font-extrabold text-lg tracking-tight text-foreground mb-1">
                  {title}
                </h3>
                <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/50">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm disabled:opacity-50 ${
                  variant === "danger"
                    ? "bg-red-500 text-white hover:bg-red-600 shadow-red-500/20"
                    : variant === "warning"
                    ? "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/20"
                    : "bg-foreground text-background hover:opacity-90"
                }`}
              >
                {isLoading ? "Processing..." : confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

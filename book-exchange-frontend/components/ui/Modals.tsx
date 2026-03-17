"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {

  return (
    <AnimatePresence>
      {isOpen && (

        <motion.div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}  // click outside closes modal
        >

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            className="w-full max-w-md bg-white/90 backdrop-blur rounded-xl p-6 shadow-2xl border border-gray-200"
          >
            {children}
          </motion.div>

        </motion.div>

      )}
    </AnimatePresence>
  );
}



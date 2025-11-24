"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoSearch } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Modal açıldığında inputa odaklan
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Arka plan karartma (Backdrop) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
          />

          {/* Arama Paneli (Üstten kayarak gelir) */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 w-full bg-white z-[70] shadow-xl py-8 px-4 md:px-8"
          >
            <div className="max-w-4xl mx-auto relative">
              <button
                onClick={onClose}
                className="absolute -top-4 right-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <IoClose size={24} className="text-gray-500" />
              </button>

              <form onSubmit={handleSearch} className="mt-4">
                <div className="relative border-b-2 border-gray-200 focus-within:border-(--raw-umber) transition-colors">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Ürün ara..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full py-4 pl-2 pr-12 text-2xl md:text-3xl font-light outline-none bg-transparent placeholder:text-gray-300 text-(--jet)"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-(--raw-umber) transition-colors"
                  >
                    <GoSearch size={28} />
                  </button>
                </div>
              </form>

              <div className="mt-4 text-sm text-gray-500">
                Popüler:{" "}
                <span className="cursor-pointer hover:underline mx-1">
                  Duvar Rafı
                </span>
                ,
                <span className="cursor-pointer hover:underline mx-1">
                  TV Ünitesi
                </span>
                ,
                <span className="cursor-pointer hover:underline mx-1">
                  Ahşap
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

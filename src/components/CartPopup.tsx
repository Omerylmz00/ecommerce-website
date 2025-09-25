"use client";
import { useStore } from "@/context/StoreContext";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPopup() {
  const { showCartPopup, lastAddedProduct } = useStore();

  if (!lastAddedProduct) return null;

  return (
    <AnimatePresence>
      {showCartPopup && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 right-4 w-80 bg-white shadow-lg rounded-lg p-4 z-50"
        >
          <div className="flex items-start space-x-4">
            <Image
              src={lastAddedProduct.image_urls[0]}
              alt={lastAddedProduct.title}
              width={80}
              height={80}
              className="rounded object-cover"
            />
            <div className="flex-1">
              <p className="text-green-600 font-semibold">Added to Cart</p>
              <h3 className="font-bold">{lastAddedProduct.title}</h3>
              <p className="text-gray-600">{lastAddedProduct.base_price} TL</p>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <Link
              href="/cart"
              className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
            >
              View Cart
            </Link>
            <Link
              href="/checkout"
              className="px-4 py-2 bg-black text-white rounded text-sm hover:bg-gray-800"
            >
              Checkout
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

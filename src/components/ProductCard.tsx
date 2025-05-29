'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ProductCard({ product }: { product: any }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer p-4"
    >
      <Image
        src={product.image}
        alt={product.name}
        width={400}
        height={250}
        className="rounded-lg object-cover w-full h-56"
      />
      <div className="text-center mt-4">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{product.name}</h3>
        <p className="text-lg text-gray-700 font-medium">{product.price} ₺</p>
      </div>
    </motion.div>
  );
}
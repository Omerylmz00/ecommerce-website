'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ProductCard({ product }: { product: any }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      <Image
        src={product.image}
        alt={product.name}
        width={400}
        height={300}
        className="rounded-t-xl object-cover w-full h-60"
      />
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 font-medium">{product.price} ₺</p>
      </div>
    </motion.div>
  );
}

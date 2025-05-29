'use client';

import Image from 'next/image';
import Link from 'next/link';
import products from '@/data/products';

export default function ProductsPage() {
  return (
    <main className="pt-24 pb-16 px-4 min-h-screen bg-gray-50">
      {/* Başlık ve alt çizgi */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-gray-900">Ürünler</h2>
        <div className="w-24 h-[3px] bg-black mx-auto mt-2" />
      </div>

      {/* Ürün Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {products.map((product, index) => (
          <Link href={`/products/${product.slug}`} key={index}>
            <div className="border border-black bg-white rounded-xl shadow hover:shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer">
              <div className="relative w-full h-56 rounded-t-xl overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="text-md text-gray-700 font-medium mt-1">{product.price} $</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
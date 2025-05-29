
'use client';

import { useParams } from 'next/navigation';
import { products } from '@/data/productsData';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return <div className="text-center mt-20 text-red-500 text-xl">Ürün bulunamadı.</div>;
  }

  return (
    <main className="pt-24 px-4 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative w-full h-96 md:w-1/2">
          <Image src={product.image} alt={product.name} fill className="object-cover rounded-xl" />
        </div>
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-xl font-semibold text-black mb-6">{product.price} $</p>
          <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition">Sepete Ekle</button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/products" className="text-blue-600 hover:underline">
          ← Tüm Ürünlere Geri Dön
        </Link>
      </div>
    </main>
  );
}
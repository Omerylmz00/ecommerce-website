'use client';

import ProductCard from '@/components/ProductCard';

const mockProducts = [
  {
    id: 1,
    name: 'Ahşap Sandalye',
    price: 999,
    image: 'https://source.unsplash.com/400x300/?chair',
  },
  {
    id: 2,
    name: 'Modern Koltuk',
    price: 2999,
    image: 'https://source.unsplash.com/400x300/?sofa',
  },
  {
    id: 3,
    name: 'Yemek Masası',
    price: 1799,
    image: 'https://source.unsplash.com/400x300/?table',
  },
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen px-6 py-12 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-center">Ürünler</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}

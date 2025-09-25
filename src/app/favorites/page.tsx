// src/app/favorites/page.tsx
"use client";
import { useStore } from "@/context/StoreContext";
import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/context/StoreContext";

export default function FavoritesPage() {
  const { favorites, removeFromFavorites } = useStore();

  return (
    <main className="pt-24 px-4 max-w-6xl mx-auto min-h-screen bg-white text-black">
      <h1 className="text-3xl font-bold mb-8">Favorilerim</h1>
      {favorites.length === 0 ? (
        <p>Henüz favori ürün yok.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {favorites.map(
            ({ title, base_price, image_urls, slug }: Product, idx: number) => (
              <Link key={idx} href={`/products/${slug}`}>
                <div className="border p-4 rounded shadow hover:shadow-lg transition">
                  <div className="relative w-full h-48">
                    <Image
                      src={image_urls[0]}
                      alt={title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <h2 className="mt-2 font-semibold">{title}</h2>
                  <p className="text-sm text-gray-600">{base_price} TL</p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromFavorites(slug);
                    }}
                    className="mt-2 text-sm text-red-500 hover:underline"
                  >
                    Favorilerden Kaldır
                  </button>
                </div>
              </Link>
            )
          )}
        </div>
      )}
    </main>
  );
}

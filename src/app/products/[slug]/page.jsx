"use client";
import toast from "react-hot-toast";
import { useStore } from "@/context/StoreContext";
import { supabase } from "@/utils/supabaseClient";
import { slugify } from "@/utils/slugify";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug;
  return <ProductDetailClient slug={slug} />;
}

function ProductDetailClient({ slug }) {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const { addToCart, addToFavorites, favorites } = useStore();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchData() {
      const { data: products, error } = await supabase
        .from("products")
        .select("*");
      if (error || !products) {
        setError("Ürünler alınamadı.");
        return;
      }

      const matched = products.find((p) => slugify(p.title) === slug);
      if (!matched) {
        setError("Ürün bulunamadı.");
        return;
      }

      setProduct(matched);
    }

    fetchData();
  }, [slug]);

  if (error) {
    return (
      <div className="text-center mt-20 text-red-500 text-xl">{error}</div>
    );
  }

  if (!product) {
    return (
      <div className="text-center mt-20 text-gray-500 text-xl">
        Yükleniyor...
      </div>
    );
  }

  return (
    <main className="pt-24 px-4 max-w-6xl mx-auto min-h-screen bg-white text-black">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="grid grid-cols-2 gap-4">
          {product.image_urls?.map((url, idx) => (
            <div key={idx} className="relative w-full h-64">
              <Image
                src={url}
                alt={`${product.title} görseli ${idx + 1}`}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">{product.title}</h1>
          <p className="text-gray-700 text-md">{product.description}</p>
          <p className="text-2xl font-semibold text-black">
            {product.base_price} TL
          </p>
          <p className="text-sm text-gray-500">Kargo: Ücretsiz</p>
          <ul className="text-sm text-gray-700 space-y-1 mt-4">
            <li>
              <strong>Boyutlar:</strong> {product.dimensions}
            </li>
            <li>
              <strong>Malzeme:</strong> {product.material}
            </li>
            <li>
              <strong>Teslimat:</strong> {product.delivery_time}
            </li>
          </ul>
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-1 border rounded"
            >
              -
            </button>
            <span className="text-lg">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-1 border rounded"
            >
              +
            </button>
          </div>
          <button
            onClick={() => addToFavorites(product)}
            className="px-4 py-2 border border-black text-black rounded hover:bg-gray-100"
          >
            {favorites.some((fav) => fav.slug === product.slug)
              ? "Favorilerde"
              : "Favorilere Ekle"}
          </button>
          <button
            onClick={() => {
              addToCart({ ...product, quantity });
              toast.success(`${product.title} sepete eklendi!`, {
                duration: 4000,
              });
            }}
            className="mt-6 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Sepete Ekle
          </button>
        </div>
      </div>

      <div className="mt-16 text-center">
        <Link href="/products" className="text-black-600 hover:underline">
          ← Tüm Ürünlere Geri Dön
        </Link>
      </div>
    </main>
  );
}

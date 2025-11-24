"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";

// ---- ENV
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
const IMG_BASE =
  process.env.NEXT_PUBLIC_IMAGE_BASE || (API_BASE ? `${API_BASE}/catalog` : "");

// ---- Helpers
const ACCENT = "#c79269"; // Umoni'ye benzer sıcak ton
const fmtPrice = (n, c) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: c || "TRY",
  }).format(n || 0);

function mapProduct(p) {
  const gallery =
    Array.isArray(p.image_urls) && p.image_urls.length
      ? p.image_urls
      : p.main_image_url
      ? [p.main_image_url]
      : [];

  const resolved = gallery
    .map((u) => (u?.startsWith("/static/") ? `${IMG_BASE}${u}` : u))
    .filter(Boolean);

  return {
    id: p.id,
    slug: p.slug,
    title: p.name,
    description: p.description ?? "",
    base_price: p.price,
    currency: p.currency ?? "TRY",
    sku: p.sku,
    stock_quantity: p.stock_quantity ?? 0,
    is_active: p.is_active ?? true,
    image_urls: resolved,
    // review sahte alanlar (backend gelene kadar)
    rating: Number(p.rating ?? 0), // 0–5
    review_count: Number(p.review_count ?? 0),
  };
}

function Stars({
  value = 0,
  size = 18,
  emptyColor = "#e5e7eb",
  fillColor = ACCENT,
}) {
  // 5 yıldız: dolu/boş
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Rating ${value} of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.round(value);
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={filled ? fillColor : "none"}
          >
            <path
              d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27Z"
              stroke={filled ? fillColor : emptyColor}
              strokeWidth="1.5"
            />
          </svg>
        );
      })}
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug;
  return <ProductDetailClient slug={slug} />;
}

function ProductDetailClient({ slug }) {
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState("desc"); // 'desc' | 'rev'
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [zoomOpen, setZoomOpen] = useState(false);

  const { addToCart, addToFavorites, favorites } = useStore();

  // veri çek
  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/catalog/products/by-slug/${slug}`,
          { cache: "no-store" }
        );
        if (!res.ok)
          throw new Error(await res.text().catch(() => `HTTP ${res.status}`));
        const data = await res.json();
        const mapped = mapProduct(data);
        setProduct(mapped);
        setImages(mapped.image_urls || []);
        setActiveIdx(0);
      } catch {
        setError("Ürün bulunamadı.");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const inFavorites = useMemo(
    () => !!favorites?.some?.((f) => f.slug === product?.slug),
    [favorites, product?.slug]
  );

  const prevImg = useCallback(() => {
    setActiveIdx((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const nextImg = useCallback(() => {
    setActiveIdx((i) => (i + 1) % images.length);
  }, [images.length]);

  // Lightbox kısayolları
  useEffect(() => {
    if (!zoomOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setZoomOpen(false);
      if (e.key === "ArrowLeft") prevImg();
      if (e.key === "ArrowRight") nextImg();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomOpen, prevImg, nextImg]);

  if (error) {
    return (
      <div className="text-center mt-24 text-red-500 text-lg">{error}</div>
    );
  }
  if (loading || !product) {
    return (
      <div className="text-center mt-24 text-gray-500 text-lg">Yükleniyor…</div>
    );
  }

  return (
    <main
      className="pt-24 pb-16 px-4 bg-white text-gray-900"
      style={{ ["--accent"]: ACCENT }}
    >
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto mb-6 text-sm text-gray-600">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-1">/</span>
        <Link href="/products" className="hover:underline">
          Shop
        </Link>
        <span className="mx-1">/</span>
        <span className="text-gray-900">{product.title}</span>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[110px_1fr_1fr] gap-6 md:gap-10">
        {/* sol dikey küçük görseller */}
        <aside className="order-2 md:order-1 md:sticky md:top-24 self-start">
          <div className="hidden md:flex flex-col gap-3 max-h-[560px] overflow-auto pr-1">
            {images.map((u, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`relative w-[100px] aspect-[1/1] rounded-xl overflow-hidden border transition
                 ${
                   i === activeIdx
                     ? "border-black"
                     : "border-gray-200 hover:border-gray-400"
                 }`}
                aria-label={`Görsel ${i + 1}`}
              >
                <Image
                  src={u}
                  alt={`thumb-${i + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* mobilde küçük görseller alta yatay */}
          <div className="md:hidden mt-3 grid grid-cols-5 gap-2">
            {images.map((u, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`relative aspect-square rounded-lg overflow-hidden border transition
                 ${i === activeIdx ? "border-black" : "border-gray-200"}`}
                aria-label={`Görsel ${i + 1}`}
              >
                <Image
                  src={u}
                  alt={`thumb-${i + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </aside>

        {/* büyük görsel + oklar */}
        <section className="order-1 md:order-2">
          <div className="relative w-full aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
            {images[activeIdx] ? (
              <Image
                src={images[activeIdx]}
                alt={`${product.title} görseli`}
                fill
                className="object-cover"
                priority
                onClick={() => setZoomOpen(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Görsel yok
              </div>
            )}

            {/* sol/sağ oklar */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImg}
                  aria-label="Önceki görsel"
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/90 backdrop-blur border border-gray-200 flex items-center justify-center hover:scale-105"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M15 6 9 12l6 6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={nextImg}
                  aria-label="Sonraki görsel"
                  className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/90 backdrop-blur border border-gray-200 flex items-center justify-center hover:scale-105"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </section>

        {/* sağ bilgi sütunu */}
        <section className="order-3 flex flex-col gap-5">
          {/* yıldız + review sayısı */}
          <div className="flex items-center gap-2">
            <Stars value={product.rating} />
            <span className="text-sm text-gray-600">
              ({product.review_count || 0} reviews)
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold">{product.title}</h1>

          {/* fiyat */}
          <div className="flex items-center gap-3">
            <span
              className="text-3xl md:text-[34px] font-semibold"
              style={{ color: ACCENT }}
            >
              {fmtPrice(product.base_price, product.currency)}
            </span>
            {/* örnek “eski fiyat” ve indirim rozeti istersen ileride buraya ekleyebiliriz */}
          </div>

          {/* izleniyor mesajı (statik) */}
          <div className="flex items-center gap-2 py-3 border-y">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle
                cx="12"
                cy="12"
                r="3"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <span className="text-gray-700">
              <b>39</b> kişi şu an bu ürüne bakıyor
            </span>
          </div>

          {/* kısa açıklama */}
          {product.description && (
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* adet + sepete ekle */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 hover:bg-gray-50"
                aria-label="Azalt"
              >
                −
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-2 hover:bg-gray-50"
                aria-label="Arttır"
              >
                +
              </button>
            </div>

            <button
              onClick={() => {
                addToCart({ ...product, quantity });
                toast.success(`${product.title} sepete eklendi!`, {
                  duration: 3000,
                });
              }}
              className="flex-1 px-6 py-3 rounded-md bg-black text-white text-sm md:text-base font-semibold transition-colors hover:bg-[var(--accent)]"
            >
              Sepete Ekle
            </button>
          </div>

          {/* Wishlist / Compare / Share */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => {
                addToFavorites(product);
                toast.success(
                  inFavorites ? "Zaten favorilerde" : "Favorilere eklendi",
                  { duration: 2000 }
                );
              }}
              className="flex items-center justify-center gap-2 border rounded-full py-3 px-4 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21s-7.5-4.35-9.5-8.5C1 9.5 3.5 6 7 6c2 0 3 .5 5 2 2-1.5 3-2 5-2 3.5 0 6 3.5 4.5 6.5C19.5 16.65 12 21 12 21Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              {inFavorites ? "Favorilerde" : "Favori"}
            </button>

            <button
              onClick={() => toast("Karşılaştırma listesi yakında")}
              className="flex items-center justify-center gap-2 border rounded-full py-3 px-4 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 4v16M18 4v16M10 8h4M10 16h4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              Compare
            </button>

            <button
              onClick={async () => {
                try {
                  if (navigator.share)
                    await navigator.share({
                      title: product.title,
                      url: window.location.href,
                    });
                  else {
                    await navigator.clipboard.writeText(window.location.href);
                    toast.success("Bağlantı kopyalandı");
                  }
                } catch {}
              }}
              className="flex items-center justify-center gap-2 border rounded-full py-3 px-4 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm16-8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM8 16l8-8M8 8l8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Share
            </button>
          </div>

          {/* meta */}
          <div className="mt-2 text-sm text-gray-700 space-y-1">
            <div>
              <span className="text-gray-500">SKU:</span> <b>{product.sku}</b>
            </div>
            <div>
              <span className="text-gray-500">Stok:</span>{" "}
              {product.stock_quantity > 0 ? (
                <b className="text-emerald-600">Var</b>
              ) : (
                <b className="text-red-600">Tükendi</b>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Sekmeler */}
      <section className="max-w-7xl mx-auto mt-12">
        <div className="flex border-b">
          <button
            onClick={() => setTab("desc")}
            className={`px-4 md:px-6 py-3 text-sm md:text-base ${
              tab === "desc"
                ? "border-b-2 border-black font-medium"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setTab("rev")}
            className={`px-4 md:px-6 py-3 text-sm md:text-base ${
              tab === "rev"
                ? "border-b-2 border-black font-medium"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Reviews ({product.review_count || 0})
          </button>
        </div>

        {tab === "desc" ? (
          <div className="pt-6 text-gray-700 leading-relaxed">
            {product.description || "Bu ürün için açıklama eklenmemiştir."}
          </div>
        ) : (
          <div className="pt-6">
            {product.review_count > 0 ? (
              <div className="rounded-xl border p-5">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gray-100" />
                  <div>
                    <div className="font-medium">Wpbingo</div>
                    <div className="text-xs text-gray-500">
                      January 11, 2021
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-gray-700">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit…
                </div>
              </div>
            ) : (
              <div className="text-gray-600">Henüz yorum yok.</div>
            )}
          </div>
        )}
      </section>

      {/* LIGHTBOX */}
      {zoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          {/* index badge */}
          <div className="absolute top-5 left-5 text-white text-xs md:text-sm px-3 py-1 rounded-full bg-black/50">
            {activeIdx + 1} / {images.length}
          </div>

          {/* close */}
          <button
            onClick={() => setZoomOpen(false)}
            aria-label="Kapat"
            className="absolute top-5 right-5 size-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* görsel */}
          <div className="relative w-[90vw] h-[80vh]">
            <Image
              src={images[activeIdx]}
              alt={`zoom-${activeIdx + 1}`}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* oklar */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImg}
                className="absolute left-6 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center"
                aria-label="Önceki"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 6 9 12l6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                onClick={nextImg}
                className="absolute right-6 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center"
                aria-label="Sonraki"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </main>
  );
}

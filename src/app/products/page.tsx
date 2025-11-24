"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Children,
  cloneElement,
  isValidElement,
  MouseEventHandler,
  ReactNode,
} from "react";
import { useEffect, useMemo, useState, useRef } from "react";
import { useStore } from "@/context/StoreContext";
import type { Product as StoreProduct } from "@/context/StoreContext";

import { BsGrid3X3 } from "react-icons/bs";
import { CiGrid2V } from "react-icons/ci";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { FiShoppingBag } from "react-icons/fi";
import { IoChevronDown } from "react-icons/io5";
import { GrFavorite } from "react-icons/gr";
import { LucideLayoutList } from "lucide-react";
import { MdCompareArrows } from "react-icons/md";

/* ---------- Types ---------- */
type ProductCard = {
  id: number;
  name: string;
  slug: string;
  price: number;
  currency: string;
  image: string | null;
  category_id: number | null;
};

type Category = {
  id: number;
  name: string;
  parent_id: number | null;
};

type SortKey = "latest" | "price-asc" | "price-desc" | "name-asc";
type Layout = "list" | "grid-2" | "grid-3" | "grid-4";

/* ---------- Constants ---------- */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string | undefined;
const IMG_BASE =
  (process.env.NEXT_PUBLIC_IMAGE_BASE as string | undefined) ||
  (API_BASE ? `${API_BASE}/catalog` : "");

const ACCENT = "#996c49";

/* ---------- Helpers ---------- */
const formatPrice = (n: number, c: string) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: c || "TRY",
  }).format(n || 0);

const toStoreProduct = (product: ProductCard): StoreProduct => {
  const normalizedId =
    typeof product.id === "number" &&
    Number.isFinite(product.id) &&
    product.id !== 0
      ? String(product.id)
      : product.slug;

  return {
    id: normalizedId,
    slug: product.slug,
    title: product.name,
    base_price: product.price,
    image_urls:
      product.image && product.image.length > 0 ? [product.image] : [],
  };
};

/* ---------- Small UI bits ---------- */
function Stars({ value = 0, size = 14 }: { value?: number; size?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={value > i ? "text-yellow-400" : "text-gray-300"}
          fill="currentColor"
        >
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

/** Umoni tarzı dikey aksiyon + yanına kayan label */
function HoverAction({
  label,
  children,
  onClick,
}: {
  label: string;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  const iconSize = 18;

  const childrenWithProps = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, { size: iconSize } as { size: number });
    }

    return child;
  });

  return (
    <div className="relative group/action">
      <button
        onClick={onClick}
        /* --- GÜNCELLENMİŞ className --- */
        className="
          size-12 rounded-full shadow-sm border border-gray-200 
          flex items-center justify-center 
          transition-colors duration-200
          
          bg-white text-gray-900 
          
          hover:bg-[#996c49] hover:text-white hover:border-[#996c49]
        "
        /* --- KALDIRILAN PROPS (style, onMouseEnter, onMouseLeave) --- */
        aria-label={label}
      >
        {children}
      </button>

      {/* kayarak görünen siyah label (Bu kısım zaten doğru) */}
      <span
        className="pointer-events-none absolute right-[calc(100%+10px)] top-1/2 -translate-y-1/2 origin-right rounded-sm bg-black text-white text-xs font-medium px-3 py-1 opacity-0 translate-x-2 group-hover/action:opacity-100 group-hover/action:translate-x-0 transition"
        style={{ whiteSpace: "nowrap" }}
      >
        {label}
      </span>
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductCard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [err, setErr] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // filters/sort
  const [selectedCats, setSelectedCats] = useState<number[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sortKey, setSortKey] = useState<SortKey>("latest");

  // layout
  const [layout, setLayout] = useState<Layout>("grid-3");

  // pagination
  const [page, setPage] = useState<number>(1);
  const pageSize = 12;

  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const { addToCart, addToFavorites } = useStore();

  // fetch
  useEffect(() => {
    (async () => {
      try {
        const [prRes, catRes] = await Promise.all([
          fetch(`${API_BASE}/catalog/products`, { cache: "no-store" }),
          fetch(`${API_BASE}/catalog/categories`, { cache: "no-store" }),
        ]);
        if (!prRes.ok) throw new Error(await prRes.text());
        if (!catRes.ok) throw new Error(await catRes.text());

        const prData: any[] = await prRes.json();
        const catData: Category[] = await catRes.json();

        const mapped: ProductCard[] = (Array.isArray(prData) ? prData : []).map(
          (p: any) => {
            const raw = String(p?.main_image_url ?? "");
            const img =
              raw.length > 0
                ? raw.startsWith("/static/")
                  ? `${IMG_BASE}${raw}`
                  : raw
                : null;

            return {
              id: Number(p?.id ?? 0),
              name: String(p?.name ?? ""),
              slug: String(p?.slug ?? ""),
              price: Number(p?.price ?? 0),
              currency: String(p?.currency ?? "TRY"),
              image: img,
              category_id:
                p?.category_id == null ? null : Number(p.category_id),
            };
          }
        );

        setProducts(mapped);
        setCategories(catData);
      } catch {
        setErr("Ürünler veya kategoriler alınamadı.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // filter + sort
  const filtered = useMemo(() => {
    let arr = [...products];

    if (selectedCats.length > 0) {
      arr = arr.filter(
        (p) => p.category_id != null && selectedCats.includes(p.category_id)
      );
    }

    const min =
      minPrice.trim() === "" ? -Infinity : Number(minPrice.replace(",", "."));
    const max =
      maxPrice.trim() === "" ? Infinity : Number(maxPrice.replace(",", "."));
    if (!Number.isNaN(min) && !Number.isNaN(max)) {
      arr = arr.filter((p) => p.price >= min && p.price <= max);
    }

    switch (sortKey) {
      case "price-asc":
        arr.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        arr.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        arr.sort((a, b) => a.name.localeCompare(b.name, "tr"));
        break;
      case "latest":
      default:
        break;
    }

    return arr;
  }, [products, selectedCats, minPrice, maxPrice, sortKey]);

  useEffect(() => {
    setPage(1);
  }, [selectedCats, minPrice, maxPrice, sortKey, layout]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sortRef]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  const toggleCat = (id: number) =>
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const clearFilters = () => {
    setSelectedCats([]);
    setMinPrice("");
    setMaxPrice("");
  };

  if (err) {
    return (
      <main className="pt-24 pb-16 px-4 min-h-screen">
        <div className="text-center mt-20 text-red-500 text-xl">{err}</div>
      </main>
    );
  }

  const gridClass =
    layout === "grid-2"
      ? "grid grid-cols-1 sm:grid-cols-2 gap-8"
      : layout === "grid-3"
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8";

  return (
    <main className="min-h-screen bg-(--isabelline)">
      {/* HERO */}
      <section className="relative h-[220px] md:h-[280px] w-full">
        <Image
          src="/public/images/hover/ps-17.png" // public/images/hero/shop.jpg koyarsan birebir gelir
          alt="Shop"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-white/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Shop
          </h1>
          <div className="mt-2 text-sm text-gray-700">Home / Shop</div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* SOL: Umoni tarzı filtre panel */}
          <aside className="md:col-span-3">
            <div className="sticky top-24 rounded-3xl border border-gray-200 shadow-sm p-6 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold tracking-tight">
                  Categories
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-900 underline-offset-2 hover:underline"
                >
                  Clear
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {categories.map((c) => {
                  const checked = selectedCats.includes(c.id);
                  return (
                    <label
                      key={c.id}
                      className="flex items-center gap-3 text-[17px] text-gray-900"
                    >
                      {/* custom checkbox */}
                      <span
                        className={`size-5 rounded-[3px] inline-flex items-center justify-center border transition ${
                          checked
                            ? "border-[color:var(--accent)]"
                            : "border-gray-300"
                        }`}
                        style={{ ["--accent" as any]: ACCENT }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCat(c.id)}
                          className="peer sr-only"
                        />
                        <span
                          className={`size-2.5 rounded-[2px] block opacity-0 peer-checked:opacity-100`}
                          style={{ backgroundColor: ACCENT }}
                        />
                      </span>
                      <span>
                        {c.name}
                        {/* istersen "(8)" gibi adet bilgisi eklenebilir */}
                      </span>
                    </label>
                  );
                })}
              </div>

              <hr className="my-6 border-t" />

              {/* Price (görsel olarak hoş) */}
              <div className="space-y-3">
                <div className="text-xl font-semibold">Price</div>
                {/* dekoratif bar */}
                <div className="h-[6px] rounded bg-black relative">
                  <span className="absolute -top-[7px] left-0 size-4 border-2 border-black bg-white rounded-sm" />
                  <span className="absolute -top-[7px] right-0 size-4 border-2 border-black bg-white rounded-sm" />
                </div>
                <div className="text-[15px]">
                  Range :{" "}
                  <b className="text-black-500">
                    {minPrice
                      ? formatPrice(Number(minPrice), "TRY")
                      : "$100.00"}{" "}
                    -{" "}
                    {maxPrice
                      ? formatPrice(Number(maxPrice), "TRY")
                      : "$1,250.00"}
                  </b>
                </div>

                {/* gerçek filtre girişleri (şık kutular) */}
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <input
                    inputMode="decimal"
                    pattern="[0-9,\\.]*"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2"
                    style={{ boxShadow: "0 1px 5px 0 rgba(0,0,0,.06)" }}
                  />
                  <input
                    inputMode="decimal"
                    pattern="[0-9,\\.]*"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2"
                    style={{ boxShadow: "0 1px 5px 0 rgba(0,0,0,.06)" }}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* SAĞ: Toolbar + GRID */}
          <section className="md:col-span-9">
            {/* Toolbar */}
            <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
              <div className="text-sm text-gray-600">
                Showing <b>{paged.length}</b> of <b>{filtered.length}</b>{" "}
                item(s)
              </div>

              <div className="flex items-center gap-2">
                {/* Görünüm anahtarı */}
                {(
                  [
                    ["list", <LucideLayoutList size={16} />],
                    ["grid-2", <CiGrid2V size={16} />],
                    ["grid-3", <BsGrid3X3 size={16} />],
                    ["grid-4", <TfiLayoutGrid4Alt size={16} />],
                  ] as [Layout, React.ReactNode][]
                ).map(([key, icon]) => (
                  <button
                    key={key}
                    onClick={() => setLayout(key)}
                    className={`w-9 h-9 rounded-md border flex items-center justify-center transition-colors ${
                      // 'transition-colors' ekledik
                      layout === key
                        ? "border-[#996c49] text-[#996c49]"
                        : "border-gray-300 text-gray-500 hover:text-[#996c49] hover:border-[#996c49]"
                    }`}
                    title={key}
                  >
                    {icon}
                  </button>
                ))}

                {/* --- YENİ ÖZEL SIRALAMA DROPDOWN --- */}

                {/* Seçenekleri ve etiketlerini burada tanımlıyoruz */}
                {(() => {
                  const sortOptions: { key: SortKey; label: string }[] = [
                    { key: "latest", label: "Default sorting" },
                    { key: "price-asc", label: "Price: Low to High" },
                    { key: "price-desc", label: "Price: High to Low" },
                    { key: "name-asc", label: "Name: A→Z" },
                  ];

                  // Mevcut seçili etiketi bul
                  const currentSortLabel =
                    sortOptions.find((opt) => opt.key === sortKey)?.label ||
                    "Default sorting";

                  return (
                    <div className="relative ml-3" ref={sortRef}>
                      {/* 1. Buton: Mevcut seçimi gösterir */}
                      <button
                        type="button"
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className={`flex min-w-[200px] items-center justify-between rounded-md border px-4 py-2 text-sm font-medium transition-colors
                        ${
                          isSortOpen
                            ? "bg-[#996c49] text-white border-[#996c49]" // 3. AKTİF (AÇIK) DURUMU
                            : "bg-white text-black border-black hover:bg-[#996c49] hover:text-white hover:border-[#996c49]" // 1. NORMAL ve 2. HOVER DURUMU
                        }
                        `}
                      >
                        <span>{currentSortLabel}</span>
                        {/* YENİ İKON */}
                        <IoChevronDown
                          size={16}
                          className={`transform transition-transform ${
                            isSortOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* 2. Açılır Menü: Sadece isSortOpen true ise görünür */}
                      {isSortOpen && (
                        <div className="absolute left-0 top-full z-10 mt-1 w-full rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                          {sortOptions.map((option) => (
                            <button
                              key={option.key}
                              type="button"
                              onClick={() => {
                                setSortKey(option.key);
                                setIsSortOpen(false);
                              }}
                              className={`block w-full px-4 py-2 text-left text-sm transition-colors ${
                                sortKey === option.key
                                  ? "font-semibold text-[#996c49]" // Aktif seçenek
                                  : "text-gray-700 hover:bg-gray-100" // Diğer seçenekler
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* LIST VIEW (detaylı kart) */}
            {!loading && layout === "list" && (
              <div className="space-y-8">
                {paged.map((p) => (
                  <article
                    key={p.id}
                    className="group relative rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition p-6"
                  >
                    <div className="grid md:grid-cols-[360px,1fr] gap-8">
                      {/* image */}
                      <Link href={`/products/${p.slug || "#"}`}>
                        <div className="relative w-full md:w-[360px] aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              Görsel yok
                            </div>
                          )}

                          {/* sağ dikey aksiyonlar */}
                          <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition">
                            <HoverAction
                              label="Add to cart"
                              onClick={(e) => {
                                e.preventDefault();
                                addToCart({
                                  ...toStoreProduct(p),
                                  quantity: 1,
                                });
                              }}
                            >
                              <FiShoppingBag size={20} />
                            </HoverAction>
                            <HoverAction
                              label="Wishlist"
                              onClick={(e) => {
                                e.preventDefault();
                                addToFavorites(toStoreProduct(p));
                              }}
                            >
                              <GrFavorite size={20} />
                            </HoverAction>
                            <HoverAction label="Compare" onClick={() => {}}>
                              <MdCompareArrows size={20} />
                            </HoverAction>
                          </div>
                        </div>
                      </Link>

                      {/* content */}
                      <div className="flex flex-col gap-3">
                        <Link
                          href={`/products/${p.slug || "#"}`}
                          className="block"
                        >
                          <h3 className="text-2xl font-semibold text-gray-900">
                            {p.name}
                          </h3>
                        </Link>

                        <div className="flex items-center gap-2">
                          <Stars value={0} />
                          <span className="text-sm text-gray-500">(0)</span>
                        </div>

                        <div className="text-2xl font-semibold">
                          <span style={{ color: ACCENT }}>
                            {formatPrice(p.price, p.currency)}
                          </span>
                        </div>

                        <p className="text-gray-600 text-sm">
                          {/* kısa açıklama alanı istersen burada gösterilebilir */}
                        </p>

                        <div className="mt-2">
                          <button
                            onClick={() =>
                              addToCart({ ...toStoreProduct(p), quantity: 1 })
                            }
                            className="px-7 py-3 rounded-md text-white text-sm font-medium transition"
                            style={{ backgroundColor: "black" }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor = ACCENT)
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor = "black")
                            }
                          >
                            Add To Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* GRID VIEWS (Umoni kartı) */}
            {loading ? (
              <div className={gridClass}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-2xl bg-white overflow-hidden animate-pulse"
                  >
                    <div className="h-60 bg-gray-100" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-100 rounded w-2/3" />
                      <div className="h-4 bg-gray-100 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : layout !== "list" ? (
              <>
                <div className={gridClass}>
                  {paged.map((p) => (
                    <article
                      key={p.id}
                      className="group relative rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition"
                    >
                      <Link href={`/products/${p.slug || "#"}`}>
                        <div className="relative w-full aspect-[4/5] bg-gray-100">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              Görsel yok
                            </div>
                          )}

                          {/* sağ dikey aksiyonlar + label */}
                          <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition">
                            <HoverAction
                              label="Add to cart"
                              onClick={(e) => {
                                e.preventDefault();
                                addToCart({
                                  ...toStoreProduct(p),
                                  quantity: 1,
                                });
                              }}
                            >
                              <FiShoppingBag size={20} />
                            </HoverAction>
                            <HoverAction
                              label="Wishlist"
                              onClick={(e) => {
                                e.preventDefault();
                                addToFavorites(toStoreProduct(p));
                              }}
                            >
                              <GrFavorite size={20} />
                            </HoverAction>
                            <HoverAction label="Compare" onClick={() => {}}>
                              <MdCompareArrows size={20} />
                            </HoverAction>
                          </div>

                          {/* alt bant CTA (Umoni’deki gibi hover’da görünür) */}
                          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                addToCart({
                                  ...toStoreProduct(p),
                                  quantity: 1,
                                });
                              }}
                              className="w-full rounded-xl text-white text-sm py-2.5 font-medium transition"
                              style={{ backgroundColor: "black" }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor = ACCENT)
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "black")
                              }
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </Link>

                      {/* content */}
                      <div className="p-5">
                        <Link
                          href={`/products/${p.slug || "#"}`}
                          className="block"
                        >
                          <h3 className="text-[16px] font-semibold text-gray-900 line-clamp-1 hover:underline underline-offset-2">
                            {p.name}
                          </h3>
                        </Link>

                        <div className="mt-1 flex items-center gap-2">
                          <Stars value={0} size={12} />
                          <span className="text-xs text-gray-500">(0)</span>
                        </div>

                        <div
                          className="mt-1 text-[16px] font-semibold"
                          style={{ color: ACCENT }}
                        >
                          {formatPrice(p.price, p.currency)}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* PAGINATION */}
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-2 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50"
                  >
                    Prev
                  </button>

                  {Array.from({ length: pageCount }).map((_, i) => {
                    const n = i + 1;
                    const active = n === page;
                    return (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={`min-w-9 h-9 px-3 text-sm rounded-lg border ${
                          active
                            ? "bg-black text-white border-black"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {n}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                    disabled={page === pageCount}
                    className="px-3 py-2 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : null}
          </section>
        </div>
      </section>
    </main>
  );
}

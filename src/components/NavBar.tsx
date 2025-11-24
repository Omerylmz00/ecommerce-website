"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/context/StoreContext";
import SearchModal from "./SearchModal"; // <--- Yeni eklediğimiz modal

// --- İKONLAR ---
import { GoPerson, GoSearch } from "react-icons/go";
import { GrFavorite } from "react-icons/gr";
import { FiShoppingBag } from "react-icons/fi";
import { TbMenu2 } from "react-icons/tb";
import { IoClose } from "react-icons/io5";

// Buton Helper
function IconBtn({
  href,
  title,
  children,
  badge,
  onClick, // onClick desteği eklendi
}: {
  href?: string;
  title: string;
  children: React.ReactNode;
  badge?: number;
  onClick?: () => void;
}) {
  const baseClass =
    "relative inline-flex items-center justify-center size-10 rounded-full transition-colors hover:bg-(--raw-umber) hover:text-white cursor-pointer";

  const content = (
    <>
      {children}
      {!!badge && (
        <span className="absolute -top-1 -right-2 min-w-5 h-5 px-1 rounded-full bg-black text-white text-[10px] leading-5 text-center border border-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} title={title} className={baseClass}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href || "#"} title={title} className={baseClass}>
      {content}
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { cartItems, favorites } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // <--- Search state

  // Hidrasyon hatası çözümü
  const [clientCartCount, setClientCartCount] = useState(0);
  const [clientFavCount, setClientFavCount] = useState(0);

  useEffect(() => {
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const favCount = Array.isArray(favorites) ? favorites.length : 0;

    setClientCartCount(cartCount);
    setClientFavCount(favCount);
  }, [cartItems, favorites]);

  const linkCls = (href: string) =>
    `px-3 py-2 text-sm transition-colors ${
      pathname === href
        ? "text-(--raw-umber) font-bold underline underline-offset-4"
        : "text-gray-700 hover:text-(--raw-umber) hover:underline hover:underline-offset-4"
    }`;

  const mobileLinkCls = (href: string) =>
    `block px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
      pathname === href
        ? "bg-(--isabelline) text-(--raw-umber)"
        : "text-(--foreground) hover:bg-gray-100"
    }`;

  return (
    <>
      <header className="site-header fixed inset-x-0 top-0 z-50 border-b border-black/5 transition-colors bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-20 grid grid-cols-3 items-center">
            {/* SOL: Nav & Mobile Menu */}
            <div className="flex items-center justify-start">
              <nav className="hidden md:flex items-center gap-2">
                <Link href="/" className={linkCls("/")}>
                  HOME
                </Link>
                <Link href="/products" className={linkCls("/products")}>
                  SHOP
                </Link>
                <Link href="/about" className={linkCls("/about")}>
                  ABOUT
                </Link>
                <Link href="/contact" className={linkCls("/contact")}>
                  CONTACT
                </Link>
              </nav>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="inline-flex items-center justify-center size-10 rounded-full hover:bg-gray-100 md:hidden"
              >
                <TbMenu2 size={22} />
              </button>
            </div>

            {/* ORTA: Logo */}
            <div className="flex items-center justify-center">
              <Link
                href="/"
                className="text-xl md:text-2xl font-extrabold tracking-widest whitespace-nowrap text-(--jet)"
              >
                BARIDA LUMION
              </Link>
            </div>

            {/* --- SAĞ BÖLÜM --- */}
            <div className="flex items-center justify-end gap-1">
              {/* Search: SADECE MASAÜSTÜNDE GÖSTER (hidden md:flex) */}
              {/* Mobilde arama çubuğunu menünün içine koyacağız */}
              <div className="hidden md:flex">
                <IconBtn title="Search" onClick={() => setIsSearchOpen(true)}>
                  <GoSearch size={20} />
                </IconBtn>
              </div>

              {/* Account: SADECE MASAÜSTÜNDE (Zaten öyleydi) */}
              <div className="hidden md:flex">
                <IconBtn href="/login" title="Account">
                  <GoPerson size={20} />
                </IconBtn>
              </div>

              {/* Favorites: SADECE MASAÜSTÜNDE GÖSTER (hidden md:flex) */}
              <div className="hidden md:flex">
                <IconBtn
                  href="/favorites"
                  title="Favorites"
                  badge={clientFavCount}
                >
                  <GrFavorite size={20} />
                </IconBtn>
              </div>

              {/* Cart: HER ZAMAN GÖRÜNÜR (flex) */}
              {/* Mobilde sağ üstte tek başına kral gibi duracak */}
              <IconBtn href="/cart" title="Cart" badge={clientCartCount}>
                <FiShoppingBag size={20} />
              </IconBtn>
            </div>
          </div>
        </div>
      </header>

      {/* --- SEARCH MODAL --- */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* --- MOBILE MENU --- */}
      {/* Backdrop */}
      {/* --- MOBILE MENU CONTENT --- */}
      <div
        className={`fixed top-0 left-0 z-[60] h-full w-[85vw] max-w-[360px] bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* 1. Menü Başlığı & Kapat */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-gray-100">
          <span className="font-bold text-lg text-(--jet)">MENU</span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* 2. Mobil Arama Çubuğu (En Üste) */}
        <div className="p-5 pb-0">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden flex items-center px-3 py-2.5 focus-within:ring-1 focus-within:ring-(--raw-umber)">
            <GoSearch size={18} className="text-gray-500 shrink-0" />
            <input
              type="text"
              placeholder="Ürün ara..."
              className="w-full bg-transparent outline-none text-sm ml-2 text-(--jet) placeholder:text-gray-400"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // Buraya basit bir yönlendirme mantığı
                  // window.location.href = `/products?q=${e.currentTarget.value}`;
                  setIsMobileMenuOpen(false);
                }
              }}
            />
          </div>
        </div>

        {/* 3. Linkler */}
        <nav className="flex-1 flex flex-col p-5 space-y-2 overflow-y-auto">
          <Link
            href="/"
            className={mobileLinkCls("/")}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            HOME
          </Link>
          <Link
            href="/products"
            className={mobileLinkCls("/products")}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            SHOP
          </Link>
          <Link
            href="/about"
            className={mobileLinkCls("/about")}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            ABOUT
          </Link>
          <Link
            href="/contact"
            className={mobileLinkCls("/contact")}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            CONTACT
          </Link>

          <hr className="border-gray-100 my-2" />

          {/* Favoriler Linki (ikonlu) */}
          <Link
            href="/favorites"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-(--jet) hover:bg-gray-50 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <GrFavorite size={18} />
            <span>
              Favorilerim {clientFavCount > 0 && `(${clientFavCount})`}
            </span>
          </Link>

          {/* Hesabım Linki (ikonlu) */}
          <Link
            href="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-(--jet) hover:bg-gray-50 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <GoPerson size={18} />
            <span>Giriş Yap / Kayıt Ol</span>
          </Link>
        </nav>

        {/* Alt Kısım (Opsiyonel Sosyal Medya vs.) */}
        <div className="p-5 border-t border-gray-100 text-xs text-gray-400 text-center">
          © 2025 Barida Lumion
        </div>
      </div>
    </>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import InfoPerks from "@/components/Infocarts";

// ==========================
// Hero Slider — mobile-first, desktop: left text / right image
// No hover effects. No progress bar.
// Slide transitions animate images (direction-aware).
// ==========================

type Slide = {
  id: number;
  bg: { type: "color" | "image"; value: string };
  titleLines: string[];
  subtitle?: string;
  cta?: { text: string; href?: string };
  hero: { src: string; alt?: string };
};

const SLIDE_DURATION = 5000; // ms (autoplay)

// Framer Motion variants (direction-aware)
const mobileImageVariants: Variants = {
  enter: (d: 1 | -1) => ({ x: 24 * d, opacity: 0, scale: 0.98 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (d: 1 | -1) => ({ x: -24 * d, opacity: 0, scale: 0.98 }),
};

const desktopImageVariants: Variants = {
  enter: (d: 1 | -1) => ({ x: 32 * d, opacity: 0, scale: 0.985 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (d: 1 | -1) => ({ x: -32 * d, opacity: 0, scale: 0.985 }),
};

const desktopTextVariants: Variants = {
  enter: (d: 1 | -1) => ({ x: -24 * d, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: 1 | -1) => ({ x: -24 * d, opacity: 0 }),
};

const slides: Slide[] = [
  {
    id: 1,
    bg: { type: "color", value: "#ece1d8" },
    titleLines: ["Modern ve Şık", "Dresuar"],
    subtitle: "Evinize hoş geldiniz diyen yumuşak dokular.",
    cta: { text: "Alışverişe Git", href: "#category" },
    hero: { src: "/images/hover/b5f01.png", alt: "Duo Floor Lamp" },
  },
  {
    id: 2,
    bg: { type: "color", value: "#f5e5d7" },
    titleLines: ["Tamamen", "Doğal Üretim"],
    subtitle: "Doğanın sıcaklığını evinize taşıyın.",
    cta: { text: "Sipariş ver", href: "#category" },
    hero: { src: "/images/hover/PS-9_4.webp", alt: "Cloria Chair" },
  },
  {
    id: 3,
    bg: { type: "color", value: "#dac3b2" },
    titleLines: ["Benzersiz", "Duvar Rafları"],
    subtitle: "Günün her anına yakışan tasarım.",
    cta: { text: "Şimdi İncele", href: "#category" },
    hero: { src: "/images/hover/ps8tekli_Scene7.webp", alt: "Çay Seti" },
  },
];

function HeroSliderUmoniStyle({
  onCTAClick,
  onSlideChange,
}: {
  onCTAClick?: () => void;
  onSlideChange?: (slide: Slide, index: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1); // kaydırma yönü (sağa: +1, sola: -1)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    resetTimer();
    timerRef.current = setTimeout(() => {
      setDir(1);
      setIndex((p) => (p === slides.length - 1 ? 0 : p + 1));
    }, SLIDE_DURATION);
    return resetTimer;
  }, [index, resetTimer]);

  const current = slides[index];

  useEffect(() => {
    onSlideChange?.(current, index);
  }, [current, index]);

  return (
    <section
      id="hero-root"
      role="region"
      aria-roledescription="carousel"
      aria-label="Ana görsel slider"
      aria-live="off"
      className="hero-overlap relative w-full h-[80vh] overflow-hidden"
    >
      {/* Background (color or image) */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${current.id}-${current.bg.value}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={
              current.bg.type === "color"
                ? { backgroundColor: current.bg.value }
                : {
                    backgroundImage: `url(${current.bg.value})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
            }
          />
        </AnimatePresence>
      </div>

      {/* MOBILE (default) — image top, text centered below */}
      <div className="relative z-10 h-full w-full px-4 flex flex-col items-center justify-start pt-8 md:hidden">
        {/* product image with transition */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={`m-hero-${current.id}`}
            custom={dir}
            variants={mobileImageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-[88%]"
          >
            <Image
              src={current.hero.src}
              alt={current.hero.alt || "Ürün görseli"}
              width={1200}
              height={900}
              className="w-full h-auto rounded-2xl shadow-2xl"
              priority={current.id === slides[0].id}
            />
          </motion.div>
        </AnimatePresence>

        {/* text block */}
        <div className="mt-6 text-center max-w-[560px]">
          <motion.h1
            key={`m-title-${current.id}`}
            className="text-4xl font-bold text-(--jet) leading-tight"
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            {current.titleLines.map((t, i) => (
              <span key={i} className="block">
                {t}
              </span>
            ))}
          </motion.h1>

          {current.subtitle && (
            <motion.p
              key={`m-sub-${current.id}`}
              className="mt-3 text-base text-(--foreground)"
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
            >
              {current.subtitle}
            </motion.p>
          )}

          {current.cta && (
            <motion.button
              key={`m-cta-${current.id}`}
              onClick={onCTAClick}
              className="mt-6 inline-block font-semibold border-b border-(--jet) text-(--jet) hover:text-(--raw-umber) hover:border-(--raw-umber) transition-colors"
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 6, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.08 }}
            >
              {current.cta.text}
            </motion.button>
          )}
        </div>
      </div>

      {/* DESKTOP (md+) — left text / right image. Tightened to center. */}
      <div className="hidden md:grid relative z-10 h-full max-w-6xl mx-auto px-8 lg:px-10 md:grid-cols-[560px_minmax(0,1fr)] md:gap-10 lg:gap-12 items-center">
        {/* text block (always visible) */}
        <motion.div
          key={`d-text-${current.id}`}
          custom={dir}
          variants={desktopTextVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="max-w-[560px]"
        >
          <h1 className="text-6xl font-bold text-(--jet) leading-tight">
            {current.titleLines.map((t, i) => (
              <span key={i} className={i === 0 ? "block" : "block -mt-2"}>
                {t}
              </span>
            ))}
          </h1>
          {current.subtitle && (
            <p className="mt-4 text-lg text-(--foreground)">
              {current.subtitle}
            </p>
          )}
          {current.cta && (
            <button
              onClick={onCTAClick}
              className="mt-6 inline-block font-semibold border-b border-(--jet) text-(--jet) hover:text-(--raw-umber) hover:border-(--raw-umber) transition-colors"
            >
              {current.cta.text}
            </button>
          )}
        </motion.div>

        {/* hero image (right column) with slide animation; slightly smaller width */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={`d-hero-${current.id}`}
            custom={dir}
            variants={desktopImageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative w-full max-w-[720px] h-[56vh] lg:h-[60vh] justify-self-end"
          >
            <Image
              src={current.hero.src}
              alt={current.hero.alt || "Ürün görseli"}
              fill
              sizes="(min-width: 768px) 45vw, 88vw"
              className="object-cover rounded-3xl shadow-2xl"
              priority={current.id === slides[0].id}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination (bullets only, no progress bar) */}
      <div className="absolute inset-x-0 bottom-6 z-20 flex items-center justify-center">
        <div className="flex items-center gap-8">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                setDir(i > index ? 1 : -1);
                setIndex(i);
              }}
              aria-label={`Slayt ${i + 1}`}
              aria-current={i === index}
              className={`relative text-sm font-semibold transition-colors ${
                i === index
                  ? "text-(--jet)"
                  : "text-(--foreground)/60 hover:text-(--jet)"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
              {i === index && (
                <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-(--jet)" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================
// Page Component (Home)
// ==========================

export default function HomePage() {
  const categoryRef = useRef<HTMLElement | null>(null);

  // Smooth scroll with 80px header offset
  const smoothScrollTo = (targetY: number, duration = 700) => {
    const startY = window.scrollY;
    const diff = targetY - startY;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (startTime == null) startTime = ts;
      const time = ts - startTime;
      const percent = 1 - Math.pow(1 - Math.min(time / duration, 1), 3);
      window.scrollTo(0, startY + diff * percent);
      if (time < duration) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const handleScrollToCategory = () => {
    if (categoryRef.current instanceof HTMLElement) {
      const headerOffset = 80; // px
      smoothScrollTo(categoryRef.current.offsetTop - headerOffset);
    }
  };

  const handleSlideChange = (slide: Slide) => {
    if (typeof window === "undefined") return;
    if (slide?.bg?.type === "color") {
      document.documentElement.style.setProperty(
        "--header-dynamic",
        slide.bg.value
      );
    } else {
      const fallback = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--background");
      document.documentElement.style.setProperty("--header-dynamic", fallback);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-transparent-header", "true");

    const update = () => {
      const atTop = window.scrollY < 4;
      document.documentElement.setAttribute(
        "data-at-top",
        atTop ? "true" : "false"
      );
    };
    update();
    const onScroll = () => requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeAttribute("data-transparent-header");
      document.documentElement.setAttribute("data-at-top", "false");
    };
  }, []);

  return (
    <main className="page-shell relative bg-(--isabelline) text-(--foreground)">
      {/* HERO */}
      <HeroSliderUmoniStyle
        onCTAClick={handleScrollToCategory}
        onSlideChange={handleSlideChange}
      />
      <InfoPerks />
      <div
        role="separator"
        className="my-10 md:my-14 h-px w-full bg-(--foreground)/10"
      />

      {/* ÜRÜN KATEGORİSİ */}
      <section
        ref={categoryRef}
        id="category"
        className="py-20 px-4 max-w-3xl mx-auto text-center"
      >
        <h2 className="text-2xl font-bold mb-6 text-(--jet)">
          Ürün Kategorisi
        </h2>
        <div className="border border-(--isabelline) rounded-xl overflow-hidden shadow-lg bg-(--background)">
          <Image
            src="/images/ps-17.png"
            alt="Parametrik Duvar Rafı"
            width={600}
            height={350}
            className="w-full object-cover h-[220px] md:h-[300px] transition-transform duration-500 hover:scale-105 rounded-2xl"
            priority={false}
          />
          <div className="p-4 md:p-6">
            <h3 className="text-xl font-semibold mb-2 text-(--jet)">
              Parametrik Duvar Rafı
            </h3>
            <p className="text-(--foreground)/80 mb-4 text-sm md:text-base">
              Evinizin en güzel köşesine en özel dokunuşu yapın.
            </p>
            <Link href="/products">
              <button className="px-6 py-2 bg-(--jet) text-(--background) font-medium rounded-full hover:bg-(--raw-umber) transition-colors">
                Ürünü İncele
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

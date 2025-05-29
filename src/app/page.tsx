'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/NavBar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const categoryRef = useRef<HTMLElement | null>(null);

  const heroImages = [
    '/images/hover/hover_image.jpeg',
    '/images/hover/hover_image_2.png',
    '/images/hover/ps-17.png',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === heroImages.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => resetTimeout();
  }, [currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? heroImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === heroImages.length - 1 ? 0 : prev + 1
    );
  };

  const smoothScrollTo = (targetY: number, duration = 1500) => {
    const startY = window.scrollY;
    const diff = targetY - startY;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const time = timestamp - startTime;
      const percent = Math.min(time / duration, 1);
      window.scrollTo(0, startY + diff * percent);
      if (time < duration) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const handleScrollToCategory = () => {
    if (categoryRef.current instanceof HTMLElement) {
      smoothScrollTo(categoryRef.current.offsetTop);
    }
  };

  return (
    <main className="relative bg-white text-gray-800">
      <Navbar />

      {/* HERO Carousel */}
      <section className="relative w-full h-screen overflow-hidden">
  <div className="absolute inset-0">
    {heroImages.map((img, index) => (
      <Image
        key={index}
        src={img}
        alt={`Slide ${index}`}
        fill
        style={{ objectFit: 'cover' }}
        className={`
          absolute inset-0 transition-opacity duration-1000 ease-in-out
          ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}
        `}
      />
    ))}
  </div>

  {/* Karanlık katman */}
  <div className="absolute inset-0 z-20" />

  {/* Yazılar */}
  <div className="absolute z-30 w-full h-full flex flex-col items-center justify-center text-white text-center px-4">
    <div className="max-w-2xl">
      <h1 className="text-4xl md:text-6xl font-bold drop-shadow-xl">
        Şıklık & Konfor
      </h1>
      <p className="mt-4 text-lg drop-shadow">
        Parametrik tasarım ile modern estetiği evinize taşıyın
      </p>
      <button
        onClick={handleScrollToCategory}
        className="mt-6 px-6 py-2 bg-white text-black font-semibold rounded-full shadow hover:bg-gray-100 transition"
      >
        Alışverişe Başla
      </button>
    </div>
  </div>

  {/* Slider Okları */}
  <button
    onClick={goToPrevious}
    className="absolute top-1/2 left-4 transform -translate-y-1/2 z-30 bg-white/60 hover:bg-white text-black p-2 rounded-full shadow"
  >
    <ChevronLeft size={24} />
  </button>
  <button
    onClick={goToNext}
    className="absolute top-1/2 right-4 transform -translate-y-1/2 z-30 bg-white/60 hover:bg-white text-black p-2 rounded-full shadow"
  >
    <ChevronRight size={24} />
  </button>
</section>

      {/* Ürün Kategorisi */}
      <section
        ref={categoryRef}
        className="py-20 px-4 max-w-3xl mx-auto text-center"
      >
        <h2 className="text-2xl font-bold mb-6">Ürün Kategorisi</h2>
        <div className="border rounded-xl overflow-hidden shadow-lg">
          <Image
            src="/images/ps-17.png"
            alt="Parametrik Duvar Rafı"
            width={600}
            height={350}
            className="w-full object-cover h-[220px] md:h-[300px] transition-transform duration-500 hover:scale-105"
          />
          <div className="p-4 md:p-6">
            <h3 className="text-xl font-semibold mb-2">
              Parametrik Duvar Rafı
            </h3>
            <p className="text-gray-600 mb-4 text-sm md:text-base">
              Evinizin en güzel köşesine en özel dokunuşu yapın.
            </p>
            <Link href="/products">
              <button className="px-6 py-2 bg-black text-white font-medium rounded hover:bg-gray-800 transition">
                Ürünü İncele
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
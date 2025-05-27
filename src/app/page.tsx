'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Navbar from '@/components/NavBar';

export default function HomePage() {
  const categories = [
    { title: 'Sandalye', image: 'https://source.unsplash.com/400x300/?chair' },
    { title: 'Koltuk', image: 'https://source.unsplash.com/400x300/?sofa' },
    { title: 'Masa', image: 'https://source.unsplash.com/400x300/?table' },
  ];

  return (
    <main className="relative bg-white text-gray-800">
      <Navbar />

      {/* Hero */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="/images/hover_image.jpeg"
          alt="Mobilya koleksiyonu"
          fill
          style={{ objectFit: 'cover' }}
          className="z-0 opacity-90"
        />
        <div className="z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
            Şıklık & Konfor
          </h1>
          <p className="mt-4 text-lg">Kendinize en uygun mobilyayı keşfedin</p>
          <button className="mt-6 px-6 py-2 bg-white text-black font-semibold rounded-full shadow hover:bg-gray-100 transition">
            Alışverişe Başla
          </button>
        </div>
      </section>

      {/* Kategoriler */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-8 text-center">Kategoriler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="overflow-hidden rounded-xl shadow group"
            >
              <Image
                src={cat.image}
                alt={cat.title}
                width={500}
                height={300}
                style={{ objectFit: 'cover' }}
                className="w-full h-64 group-hover:brightness-75 transition-all duration-300"
              />
              <div className="p-4 bg-white text-center">
                <h3 className="text-lg font-semibold">{cat.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}

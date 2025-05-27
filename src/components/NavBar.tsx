'use client';

import { useEffect, useState } from 'react';

export default function Navbar() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setShow(current < lastScrollY || current < 10);
      setLastScrollY(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${show ? 'translate-y-0' : '-translate-y-full'} bg-white shadow`}>
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">BARIDA LUMION</h1>
        <div className="space-x-4">
          <a href="#" className="text-gray-600 hover:text-black">Home</a>
          <a href="#" className="text-gray-600 hover:text-black">Shop</a>
          <a href="#" className="text-gray-600 hover:text-black">Contact</a>
            <a href="#" className="text-gray-600 hover:text-black">About</a>
        </div>
      </div>
    </nav>
  );
}

"use client";

export default function Footer() {
  return (
    <footer className="bg-(--isabelline) text-(--jet) mt-20 pt-12 pb-6">
      {/* Üst Kısım: Logo ve Açıklama */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start md:items-stretch">
          {/* Logo + Açıklama */}
          <div>
            <h2 className="text-2xl font-bold mb-3">BARIDA LUMION</h2>
            <p className="text-sm leading-relaxed text-gray-600">
              Parametrik mobilya tasarımlarında estetiği ve işlevselliği bir
              araya getiriyoruz.
            </p>
          </div>

          {/* Keşfet */}
          <div>
            <h3 className="text-md font-semibold mb-2">Keşfet</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>
                <a href="#">Ürünler</a>
              </li>
              <li>
                <a href="#">Hakkımızda</a>
              </li>
              <li>
                <a href="#">İletişim</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-2">Online Mağazalarımız</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>Trendyol</li>
              <li>Etsy</li>
              <li>Hepsiburada</li>
            </ul>
          </div>

          {/* Yardım */}
          <div>
            <h3 className="text-md font-semibold mb-2">Yardım</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>
                <a href="#">Sık Sorulan Sorular</a>
              </li>
              <li>
                <a href="#">Kargo & Teslimat</a>
              </li>
              <li>
                <a href="#">İade Politikası</a>
              </li>
            </ul>
          </div>

          {/* Abonelik */}
          <div className="flex flex-col gap-2 justify-start items-start h-full">
            <h3 className="text-md font-semibold">Bültene Katıl</h3>
            <p className="text-sm text-gray-600">
              Yeni koleksiyonlardan ve indirimlerden ilk sen haberdar ol.
            </p>
            <form className="flex gap-2 mt-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-(--raw-umber) transition-colors"
              >
                Gönder
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Alt Bar */}
      <div className="border-t border-gray-200 mt-10 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Barida Lumion. Tüm hakları saklıdır. |{" "}
        <a href="#" className="hover:underline">
          Gizlilik
        </a>{" "}
        |{" "}
        <a href="#" className="hover:underline">
          Şartlar
        </a>
      </div>
    </footer>
  );
}

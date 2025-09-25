"use client";
import { useStore } from "@/context/StoreContext";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useStore();

  const total = cartItems.reduce(
    (sum, item) => sum + item.base_price * item.quantity,
    0
  );

  return (
    <div className="pt-18 px-4 max-w-6xl mx-auto min-h-screen bg-white text-black">
      <h1 className="text-3xl font-bold mb-8">Sepetim</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cartItems.length === 0 ? (
          <p>Sepetiniz boş.</p>
        ) : (
          <>
            <div className="md:col-span-2 flex flex-col">
              <div className="border rounded mb-6 overflow-x-auto">
                <div className="grid grid-cols-4 md:grid-cols-6 font-semibold border-b p-4">
                  <div className="col-span-2">Product</div>
                  <div>Price</div>
                  <div>Quantity</div>
                  <div className="hidden md:block">Total</div>
                </div>
                {cartItems.map((product, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-4 md:grid-cols-6 items-center border-b p-4 gap-4"
                  >
                    <div className="col-span-2 flex items-center gap-4">
                      <div className="relative w-16 h-16">
                        <Image
                          src={product.image_urls[0]}
                          alt={product.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div>
                        <h2 className="font-medium">{product.title}</h2>
                        <button
                          onClick={() => removeFromCart(product.slug)}
                          className="text-sm text-red-500"
                        >
                          Ürünü Kaldır
                        </button>
                      </div>
                    </div>
                    <div>{product.base_price} TL</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(product.slug, product.quantity - 1)
                        }
                        className="px-2 border rounded"
                      >
                        -
                      </button>
                      <span>{product.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(product.slug, product.quantity + 1)
                        }
                        className="px-2 border rounded"
                      >
                        +
                      </button>
                    </div>
                    <div className="hidden md:block">
                      {product.base_price} TL
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border p-6 rounded shadow-md bg-gray-50 space-y-4">
              <h2 className="text-xl font-bold mb-4">Sipariş Özeti</h2>
              <div className="flex justify-between mb-2">
                <span>Ürün Toplamı</span>
                <span>{total} TL</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Kargo</span>
                <span>30 TL</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Genel Toplam</span>
                <span>{total + 30} TL</span>
              </div>
              <button className="mt-6 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
                Adres Bilgilerini Gir
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// src/app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import { StoreProvider } from "@/context/StoreContext";
import Header from "@/components/NavBar";
import CartPopup from "@/components/CartPopup";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

import { Instrument_Sans } from "next/font/google";

const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // ihtiyacın kadar
  variable: "--font-body", // CSS değişkeni
  display: "swap",
});

export const metadata = {
  title: "Barida Lumion",
  description: "Parametrik duvar raflarıyla evinize estetik katın.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" className={`${instrument.variable}`}>
      <body className="antialiased font-sans">
        <StoreProvider>
          <Header />

          <CartPopup />
          <Toaster position="top-right" />
          <main>{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}

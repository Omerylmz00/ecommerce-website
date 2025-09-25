import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import CartPopup from "@/components/CartPopup";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import type { ReactNode } from "react";
import { StoreProvider } from "@/context/StoreContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Barida Lumion",
  description: "Parametrik duvar raflarıyla evinize estetik katın.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <div className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm">
            <NavBar />
          </div>
          <CartPopup />
          <Toaster position="top-right" reverseOrder={false} />
          <main>{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}

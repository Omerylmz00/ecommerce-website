"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import toast from "react-hot-toast";

export type Product = {
  id: string;
  title: string;
  slug: string;
  base_price: number;
  image_urls: string[];
};

type CartItem = Product & { quantity: number };

type StoreContextType = {
  cartItems: CartItem[];
  favorites: Product[];
  showCartPopup: boolean;
  lastAddedProduct: Product | null;
  addToCart: (product: CartItem) => void;
  addToFavorites: (product: Product) => void;
  updateQuantity: (slug: string, newQuantity: number) => void;
  removeFromCart: (slug: string) => void;
  removeFromFavorites: (slug: string) => void;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<Product | null>(
    null
  );

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch (e) {
        console.error("Sepet verisi bozuk:", e);
      }
    }
  }, []);

  const addToCart = (newItem: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.slug === newItem.slug);
      if (existing) {
        return prev.map((item) =>
          item.slug === newItem.slug
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        return [...prev, newItem];
      }
    });

    setLastAddedProduct(newItem);
    setShowCartPopup(true);

    setTimeout(() => {
      setShowCartPopup(false);
    }, 3000);
  };

  const addToFavorites = (product: Product) => {
    const alreadyExists = favorites.some((item) => item.slug === product.slug);

    if (alreadyExists) {
      toast.error("Bu ürün zaten favorilerinizde.");
      return;
    }

    setFavorites((prev) => [...prev, product]);
    toast.success("Ürün favorilere eklendi!");
  };

  const updateQuantity = (slug: string, newQuantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.slug === slug
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      )
    );
  };

  const removeFromCart = (slug: string) => {
    setCartItems((prev) => prev.filter((item) => item.slug !== slug));
  };

  const removeFromFavorites = (slug: string) => {
    setFavorites((prev) => prev.filter((item) => item.slug !== slug));
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const value: StoreContextType = {
    cartItems,
    favorites,
    showCartPopup,
    lastAddedProduct,
    addToCart,
    addToFavorites,
    updateQuantity,
    removeFromCart,
    removeFromFavorites,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
};

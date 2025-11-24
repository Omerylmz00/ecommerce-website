"use client";

import {
  Truck,
  Headphones,
  CreditCard,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

type Perk = {
  id: number;
  icon: LucideIcon;
  title: string;
  desc: string;
};

const PERKS: Perk[] = [
  {
    id: 1,
    icon: Truck,
    title: "Free Shipping",
    desc: "On any purchase over 500$",
  },
  {
    id: 2,
    icon: Headphones,
    title: "Online Support 24/7",
    desc: "Support online 24 hours a day",
  },
  {
    id: 3,
    icon: CreditCard,
    title: "Money Return",
    desc: "Back guarantee under 7 days",
  },
  {
    id: 4,
    icon: Tag,
    title: "Member Discount",
    desc: "On every order over $120",
  },
];

function Card({ item }: { item: Perk }) {
  const Icon = item.icon;
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-(--foreground)/10 flex items-center justify-center mb-5">
        <Icon size={26} strokeWidth={2} className="text-(--jet)" />
      </div>
      <h4 className="text-xl font-semibold text-(--jet)">{item.title}</h4>
      <p className="mt-2 text-(--foreground)">{item.desc}</p>
    </div>
  );
}

export default function Infocarts() {
  return (
    <section className="py-12 md:py-16 bg-(--isabelline)">
      <div className="max-w-8xl mx-auto px-4 md:px-6">
        <Swiper
          className="perks-swiper"
          modules={[Pagination, A11y]}
          pagination={{ clickable: true }}
          watchOverflow={true} // yeterli slayt varsa pagination otomatik kilitlenir
          centerInsufficientSlides={true} // az slaytta ortala
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 18 },
            640: { slidesPerView: 2, spaceBetween: 24 },
            768: { slidesPerView: 3, spaceBetween: 32 }, // md: 3’lü görünüm
            1280: { slidesPerView: 4, spaceBetween: 36 }, // lg+: 4’lü görünüm
          }}
        >
          {PERKS.map((p) => (
            <SwiperSlide key={p.id}>
              <Card item={p} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

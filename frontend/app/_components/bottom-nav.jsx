"use client";

import { icons } from "./shared";

const ITEMS = [
  { id: "home",         label: "Pano",        icon: icons.home },
  { id: "connections",  label: "Bağlantılar", icon: icons.link },
  { id: "transactions", label: "Hareketler",  icon: icons.list },
];

export function BottomNav({ tab, onChange }) {
  return (
    <nav className="bottom-nav">
      {ITEMS.map((item) => (
        <button
          key={item.id}
          className={tab === item.id ? "active" : ""}
          onClick={() => onChange(item.id)}
        >
          {item.icon(22)}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

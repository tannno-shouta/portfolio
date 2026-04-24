"use client";

const navItems = [
  { label: "トップ", href: "#hero" },
  { label: "自己紹介", href: "#about" },
  { label: "制作実績", href: "#works" },
  { label: "お問い合わせ", href: "#contact" },
];

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 mix-blend-difference">
      <a
        href="#hero"
        className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[0.2em] uppercase text-white"
        data-cursor="link"
      >
        ST
      </a>
      <nav>
        <ul className="flex gap-8">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="font-[family-name:var(--font-noto-sans-jp)] text-sm text-white/60 transition-colors hover:text-white"
                data-cursor="link"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

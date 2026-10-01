"use client";

import Link from "@/components/locale-link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, Bell, LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { content, type Locale } from "@/lib/content";
import { createClient } from "@/lib/supabase/browser";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useMotionPreference } from "@/components/motion-experience";
import { ScrollProgress } from "@/components/marketing-motion";

type Theme = "light" | "dark";
const themeEvent = "caucebit-theme-change";
function readTheme(): Theme {
  if (typeof document === "undefined") return "light";
  const stored = document.documentElement.dataset.theme;
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
function subscribeTheme(listener: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== "caucebit-theme") return;
    document.documentElement.dataset.theme =
      event.newValue === "dark" ? "dark" : "light";
    listener();
  };
  window.addEventListener(themeEvent, listener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(themeEvent, listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function SiteHeader({ locale }: { locale: Locale }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const pathname = usePathname().replace(/^\/(en|es)(?=\/|$)/, "") || "/";
  const calm = useMotionPreference();
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 24));
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node))
        setMenuOpen(false);
    };
    const media = window.matchMedia("(min-width: 1001px)");
    const onResize = () => {
      if (media.matches) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    media.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      media.removeEventListener("change", onResize);
    };
  }, [menuOpen]);
  const router = useRouter();
  const t = content[locale];
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => "light");
  const isMarketing = /^\/(?:services(?:\/.*)?|how-it-works|about)?$/.test(
    pathname,
  );
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setSignedIn(Boolean(session?.user)),
    );
    return () => listener.subscription.unsubscribe();
  }, []);
  async function signOut() {
    setMenuOpen(false);
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }
  function toggleTheme() {
    const next = readTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.cookie =
      "caucebit-theme=" + next + "; Path=/; SameSite=Lax; Max-Age=31536000";
    try {
      localStorage.setItem("caucebit-theme", next);
    } catch {}
    window.dispatchEvent(new Event(themeEvent));
  }
  function toggleLanguage() {
    document.cookie =
      "caucebit-locale=" +
      (locale === "es" ? "en" : "es") +
      "; Path=/; SameSite=Lax; Max-Age=31536000";
    window.location.reload();
  }
  const nav = [
    { href: "/services", label: t.nav.services },
    { href: "/how-it-works", label: t.nav.process },
    { href: "/about", label: t.nav.about },
  ];
  const activeHref = nav.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/"),
  )?.href;
  return (
    <header ref={headerRef} className="site-header" data-scrolled={scrolled}>
      <div className="container header-inner">
        <Link
          href="/"
          className="brand"
          aria-label={locale === "es" ? "ImpulsArte inicio" : "ImpulsArte home"}
        >
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span>
            ImpulsArte<span className="brand-dot">.</span>
          </span>
        </Link>
        <nav
          className="desktop-nav"
          onMouseLeave={() => setHovered(null)}
          aria-label={
            locale === "es" ? "Navegación principal" : "Main navigation"
          }
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={activeHref === item.href ? "nav-active" : ""}
              aria-current={activeHref === item.href ? "page" : undefined}
              onMouseEnter={() => setHovered(item.href)}
              onFocus={() => setHovered(item.href)}
              onBlur={() => setHovered(null)}
            >
              {(hovered || activeHref) === item.href && (
                <motion.span
                  className="nav-highlight"
                  layoutId="header-nav-highlight"
                  initial={false}
                  transition={{
                    duration: calm ? 0 : 0.2,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                />
              )}
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <button
            type="button"
            className="language-switch"
            onClick={toggleLanguage}
            aria-label={
              locale === "es" ? "Switch to English" : "Cambiar a español"
            }
          >
            {locale === "es" ? "EN" : "ES"}
          </button>
          <button
            className="icon-button theme-toggle"
            onClick={toggleTheme}
            aria-label={
              locale === "es"
                ? theme === "dark"
                  ? "Cambiar a modo claro"
                  : "Cambiar a modo oscuro"
                : theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
            }
            aria-pressed={theme === "dark"}
          >
            <Sun className="theme-sun" size={19} />
            <Moon className="theme-moon" size={19} />
          </button>
          <Link
            href={signedIn ? "/dashboard" : "/signin"}
            className="signin-link"
          >
            {signedIn
              ? locale === "es"
                ? "Mi espacio"
                : "My space"
              : t.nav.signin}
          </Link>
          {signedIn && (
            <Link
              href="/notifications"
              className="icon-button notification-button"
              aria-label={locale === "es" ? "Notificaciones" : "Notifications"}
            >
              <Bell size={18} />
            </Link>
          )}
          {signedIn && (
            <button
              className="icon-button signout-button"
              onClick={signOut}
              aria-label={locale === "es" ? "Cerrar sesión" : "Sign out"}
            >
              <LogOut size={18} />
            </button>
          )}
          <Link href="/start" className="button button-primary header-cta">
            {t.nav.start}
            <ArrowUpRight size={17} />
          </Link>
          <button
            className="icon-button mobile-menu-button"
            ref={menuButtonRef}
            aria-controls="mobile-site-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={
              locale === "es"
                ? menuOpen
                  ? "Cerrar menú"
                  : "Abrir menú"
                : menuOpen
                  ? "Close menu"
                  : "Open menu"
            }
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <motion.nav
        id="mobile-site-navigation"
        className="mobile-nav"
        aria-label={locale === "es" ? "Navegación móvil" : "Mobile navigation"}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        initial={false}
        animate={
          menuOpen
            ? { display: "flex", opacity: 1, transform: "translateY(0)" }
            : {
                opacity: 0,
                transform: calm ? "none" : "translateY(-8px)",
                transitionEnd: { display: "none" },
              }
        }
        transition={{ duration: calm ? 0 : 0.2, ease: [0.23, 1, 0.32, 1] }}
      >
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            aria-current={activeHref === item.href ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href={signedIn ? "/dashboard" : "/signin"}
          onClick={() => setMenuOpen(false)}
        >
          {signedIn
            ? locale === "es"
              ? "Mi espacio"
              : "My space"
            : t.nav.signin}
        </Link>
        {signedIn && (
          <Link href="/notifications" onClick={() => setMenuOpen(false)}>
            {locale === "es" ? "Notificaciones" : "Notifications"}
          </Link>
        )}
        {signedIn && (
          <button className="mobile-signout" onClick={signOut}>
            {locale === "es" ? "Cerrar sesión" : "Sign out"}
          </button>
        )}
        <Link
          href="/start"
          className="mobile-cta"
          onClick={() => setMenuOpen(false)}
        >
          {t.nav.start}
        </Link>
      </motion.nav>
      {isMarketing && <ScrollProgress />}
    </header>
  );
}

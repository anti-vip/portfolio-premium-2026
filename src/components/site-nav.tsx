"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Projets", href: "/#projects" },
  { label: "Processus", href: "/#workflow" },
  { label: "Contact", href: "/#contact" }
];

export function SiteNav() {
  const [isVisible, setIsVisible] = useState(true);
  const previousScroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const latest = window.scrollY;
      const previous = previousScroll.current;
      previousScroll.current = latest;

      if (latest < 64) {
        setIsVisible(true);
        return;
      }

      setIsVisible(latest < previous);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-4 z-50 px-4 transition-all duration-200 ease-out sm:px-6",
        isVisible
          ? "translate-y-0 opacity-100"
          : "-translate-y-20 opacity-0"
      ].join(" ")}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border border-white/5 bg-background/50 px-3 backdrop-blur-2xl">
        <Link href="/" className="flex min-h-11 items-center gap-3 px-2">
          <span className="grid size-8 place-items-center rounded-full border border-primary/25 bg-primary/10 text-xs font-bold text-primary">
            AD
          </span>
          <span className="hidden font-display text-sm font-semibold tracking-normal text-foreground sm:block">
            ANTIDZN
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center rounded-full px-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          className="hidden min-h-11 items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-200 transition-colors hover:border-emerald-300/30 hover:bg-emerald-300/[0.1] xl:inline-flex"
          href="/#contact"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-55" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-300" />
          </span>
          DISPONIBILITÉ : 1 CRÉNEAU RESTANT (AVRIL/MAI)
        </Link>

        <Button asChild size="sm" variant="secondary">
          <Link href="/#contact">
            Brief
            <ArrowUpRight aria-hidden="true" data-icon="inline-end" />
          </Link>
        </Button>
      </nav>
    </header>
  );
}

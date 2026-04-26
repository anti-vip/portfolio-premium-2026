"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Projets", href: "/#projects" },
  { label: "Systeme", href: "/#system" },
  { label: "Client", href: "/#contact" }
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
        "fixed inset-x-0 top-4 z-50 px-4 transition-all duration-300 ease-out sm:px-6",
        isVisible
          ? "translate-y-0 opacity-100"
          : "-translate-y-20 opacity-0"
      ].join(" ")}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border border-white/10 bg-background/50 px-3 shadow-[0_18px_70px_rgba(0,0,0,0.34)] backdrop-blur-2xl">
        <a href="/" className="flex min-h-11 items-center gap-3 px-2">
          <span className="grid size-8 place-items-center rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary">
            P26
          </span>
          <span className="hidden font-display text-sm font-semibold tracking-normal text-foreground sm:block">
            Portfolio Premium
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center rounded-full px-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </div>

        <Button asChild size="sm" variant="secondary">
          <a href="/#contact">
            Brief
            <ArrowUpRight aria-hidden="true" data-icon="inline-end" />
          </a>
        </Button>
      </nav>
    </header>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Search, X } from "lucide-react";

const springTransition = {
  type: "spring",
  stiffness: 120,
  damping: 20
} as const;

type CommandItem = {
  id: string;
  label: string;
  detail: string;
  keywords: string[];
  run: () => void;
};

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function toggleTheme() {
  document.documentElement.classList.toggle("theme-ash");
}

function normalizeQuery(value: string) {
  return value.trim().toLowerCase();
}

export function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const commands = useMemo<CommandItem[]>(
    () => [
      {
        id: "projects-3d",
        label: "Voir les projets 3D",
        detail: "Ouvrir la Bento Grid",
        keywords: ["projets", "3d", "bento", "cases"],
        run: () => scrollToSection("projects")
      },
      {
        id: "brief",
        label: "Initier un brief",
        detail: "Accéder au tunnel client",
        keywords: ["brief", "contact", "ticket", "neon"],
        run: () => scrollToSection("contact")
      },
      {
        id: "pricing",
        label: "Voir les tarifs",
        detail: "Budget et disponibilité",
        keywords: ["tarifs", "budget", "prix", "devis"],
        run: () => scrollToSection("contact")
      },
      {
        id: "theme",
        label: "Changer le thème",
        detail: "Passer en variante ash",
        keywords: ["theme", "mode", "contrast"],
        run: toggleTheme
      }
    ],
    []
  );

  const filteredCommands = useMemo(() => {
    const value = normalizeQuery(query);

    if (!value) {
      return commands;
    }

    return commands.filter((command) => {
      const haystack = [command.label, command.detail, ...command.keywords]
        .join(" ")
        .toLowerCase();

      return haystack.includes(value);
    });
  }, [commands, query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isCommandKey = event.metaKey || event.ctrlKey;

      if (isCommandKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <motion.div
      aria-modal="true"
      className="fixed inset-0 z-[80] grid place-items-start px-4 pt-24 sm:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      transition={springTransition}
    >
      <button
        aria-label="Fermer la palette de commandes"
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
        type="button"
      />

      <motion.div
        className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-lg border border-white/10 bg-background/90 backdrop-blur-2xl"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={springTransition}
      >
        <div className="flex min-h-14 items-center gap-3 border-b border-white/5 px-4">
          <Search aria-hidden="true" className="size-4 text-primary" />
          <input
            autoFocus
            className="h-14 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tapez une commande..."
            value={query}
          />
          <kbd className="hidden rounded-md border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:inline-flex">
            esc
          </kbd>
          <button
            aria-label="Fermer"
            className="grid size-11 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
            onClick={() => setIsOpen(false)}
            type="button"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div className="grid gap-1 p-2">
          {filteredCommands.length ? (
            filteredCommands.map((command) => (
              <button
                className="group flex min-h-14 items-center justify-between rounded-lg px-4 text-left transition-colors hover:bg-white/[0.06] focus-visible:bg-white/[0.08] focus-visible:outline-none"
                key={command.id}
                onClick={() => {
                  command.run();
                  setIsOpen(false);
                }}
                type="button"
              >
                <span>
                  <span className="block text-sm font-medium text-foreground">
                    {command.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {command.detail}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                />
              </button>
            ))
          ) : (
            <p className="px-4 py-8 text-sm text-muted-foreground">
              Aucune commande. Soyez précis.
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

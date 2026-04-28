const clients = [
  "Atelier Nova",
  "Solstice",
  "Aurora",
  "Maison Cobalt",
  "Vesper",
  "Northline",
  "Obsidian",
  "Studio Minuit"
];

export function ClientMarquee() {
  const marqueeItems = [...clients, ...clients, ...clients];

  return (
    <section
      aria-label="Noms clients et marques"
      className="overflow-hidden border-y border-white/5 bg-white/[0.02] py-5"
    >
      <div className="clients-marquee-track flex w-max items-center">
        {marqueeItems.map((client, index) => (
          <span
            className="mx-5 shrink-0 font-display text-2xl font-semibold uppercase tracking-[0.12em] text-white/20 sm:text-3xl"
            key={`${client}-${index}`}
          >
            {client} <span className="text-primary/40">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}

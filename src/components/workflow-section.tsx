const steps = [
  {
    number: "01",
    title: "Immersion",
    detail: "Brief serré. Références triées. Objectif nu."
  },
  {
    number: "02",
    title: "Direction Artistique",
    detail: "3D C4D, matières, lumière, système visuel."
  },
  {
    number: "03",
    title: "Raffinement",
    detail: "Variantes, tension typographique, assets finaux."
  },
  {
    number: "04",
    title: "Déploiement",
    detail: "Cloudinary, formats propres, livraison exploitable."
  }
];

export function WorkflowSection() {
  return (
    <section id="workflow" className="relative px-5 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm uppercase tracking-[0.24em] text-primary">
          Processus
        </p>
        <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-white/5 bg-white/5 md:grid-cols-4">
          {steps.map((step) => (
            <article
              className="relative min-h-[230px] overflow-hidden bg-background p-5 sm:p-6"
              key={step.number}
            >
              <span
                aria-hidden="true"
                className="absolute -right-3 -top-4 font-display text-8xl font-semibold leading-none text-white/5 sm:text-9xl"
              >
                {step.number}
              </span>
              <div className="relative z-10 flex h-full flex-col justify-between">
                <span className="font-display text-4xl font-semibold text-primary/80">
                  {step.number}
                </span>
                <div>
                  <h2 className="font-display text-3xl font-semibold leading-none text-foreground">
                    {step.title}
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {step.detail}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

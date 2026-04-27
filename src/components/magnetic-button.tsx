"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MagneticButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

const spring = { stiffness: 150, damping: 20, mass: 0.35 };

export function MagneticButton({ href, children, className }: MagneticButtonProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, spring);
  const springY = useSpring(y, spring);

  return (
    <motion.a
      href={href}
      data-cursor="contact"
      style={{ x: springX, y: springY }}
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const magneticX = event.clientX - bounds.left - bounds.width / 2;
        const magneticY = event.clientY - bounds.top - bounds.height / 2;

        x.set(magneticX * 0.18);
        y.set(magneticY * 0.18);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={cn(
        buttonVariants({ size: "lg" }),
        "group relative overflow-hidden",
        className
      )}
    >
      <span className="relative z-10">{children}</span>
      <ArrowUpRight
        aria-hidden="true"
        data-icon="inline-end"
        className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
      <span className="absolute inset-0 translate-y-full bg-white/25 transition-transform duration-500 group-hover:translate-y-0" />
    </motion.a>
  );
}

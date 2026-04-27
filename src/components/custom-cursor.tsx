"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const spring = { stiffness: 150, damping: 20, mass: 0.32 };

function getCursorLabel(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return null;
  }

  return target.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? null;
}

export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const smoothX = useSpring(x, spring);
  const smoothY = useSpring(y, spring);
  const [label, setLabel] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    setIsFinePointer(finePointer);

    if (!finePointer) {
      return;
    }

    document.documentElement.classList.add("custom-cursor-ready");

    const onMouseMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setIsVisible(true);
      setLabel(getCursorLabel(event.target));
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      document.documentElement.classList.remove("custom-cursor-ready");
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [x, y]);

  if (!isFinePointer) {
    return null;
  }

  const isExpanded = Boolean(label);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] mix-blend-difference"
      style={{ x: smoothX, y: smoothY }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 150, damping: 20 }}
    >
      <motion.div
        className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[9px] font-semibold tracking-[0.18em] text-white"
        animate={{
          width: isExpanded ? 64 : 8,
          height: isExpanded ? 64 : 8,
          backgroundColor: isExpanded ? "rgba(255,255,255,0)" : "rgba(255,255,255,1)",
          borderColor: isExpanded ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0)",
          borderWidth: isExpanded ? 1 : 0
        }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      >
        {isExpanded ? label : null}
      </motion.div>
    </motion.div>
  );
}

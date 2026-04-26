"use client";

import { LayoutGroup } from "framer-motion";
import type { ReactNode } from "react";

export function MotionProvider({ children }: { children: ReactNode }) {
  return <LayoutGroup id="portfolio-premium">{children}</LayoutGroup>;
}

"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import { listenDivPosition } from "./utils";
import { useWindowStore } from "./window-store";

export interface WindowContainerProps {
  className?: string;
  children?: React.ReactNode;
}

export const WindowContainer: React.FC<WindowContainerProps> = ({ className, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const setContainer = useWindowStore((state) => state.setContainer);

  useEffect(() => {
    if (!ref.current) return;
    const clean = listenDivPosition(ref.current, (position) => {
      setContainer(position);
    });

    return () => clean();
  }, [ref, setContainer]);

  return (
    <div className={cn("relative overflow-hidden", className)} ref={ref}>
      {children}
    </div>
  );
};

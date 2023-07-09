"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import { WindowResizeBorder } from "./resize-border";
import { listenDivPosition, getDivPosition } from "./utils";
import { useWindowStore } from "./window-store";

export interface WindowContainerProps {
  className?: string;
  children?: React.ReactNode;
}

export const WindowContainer: React.FC<WindowContainerProps> = ({ className, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const setContainer = useWindowStore((state) => state.setContainer);
  const resizeContainer = useWindowStore((state) => state.resizeContainer);
  const resizeGridBorder = useWindowStore((state) => state.resizeGridBorder);

  useEffect(() => {
    if (!ref.current) return;
    const position = getDivPosition(ref.current);
    setContainer(position);
    const clean = listenDivPosition(ref.current, (position) => {
      resizeContainer(position);
    });

    return () => clean();
  }, [ref, setContainer, resizeContainer]);

  return (
    <div className={cn("relative overflow-hidden", className)} ref={ref}>
      {resizeGridBorder && <WindowResizeBorder {...resizeGridBorder} />}
      {children}
    </div>
  );
};

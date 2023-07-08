"use client";

import { useCallback, useEffect, useMemo } from "react";

import { cn } from "@/lib/utils";

import { Card, CardTitle } from "../ui/card";

import { useWindowStore } from "./window-store";

export interface WindowApplicationProps {
  windowKey: string;
  name?: string;
  zIndex?: number;
  className?: string;
  children?: React.ReactNode;
}

export const WindowApplication: React.FC<WindowApplicationProps> = ({
  windowKey: key,
  name,
  className,
  children,
}) => {
  const container = useWindowStore((state) => state.container);
  const position = useWindowStore((state) => state.windows[key]);
  const toTopWindow = useWindowStore((state) => state.toTopWindow);
  const updateWindow = useWindowStore((state) => state.updateWindow);
  const closeWindow = useWindowStore((state) => state.closeWindow);

  const style = useMemo(
    () =>
      position && container
        ? {
            top: position.top,
            left: position.left,
            width: position.width,
            height: position.height,
            zIndex: position.zIndex,
          }
        : {
            display: "none",
          },
    [position, container],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!position || !container) return;
      e.preventDefault();
      e.stopPropagation();
      const { clientX, clientY } = e;
      const { left, top } = position;
      toTopWindow(key);

      const handleMouseMove = (e: MouseEvent) => {
        const { clientX: x, clientY: y } = e;
        const newTop = Math.max(0, Math.min(container.height - position.height, top + y - clientY));
        const newLeft = Math.max(0, Math.min(container.width - position.width, left + x - clientX));
        updateWindow(key, { ...position, top: newTop, left: newLeft });
        toTopWindow(key);
      };
      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [key, position, container, updateWindow, toTopWindow],
  );

  useEffect(() => {
    updateWindow(key, { left: 0, top: 0, width: 400, height: 300, zIndex: 0 });
    return () => closeWindow(key);
  }, [key, closeWindow, updateWindow]);

  return (
    <Card
      style={style}
      className={cn("absolute overflow-hidden flex flex-col", className)}
      onFocus={() => toTopWindow(key)}
    >
      <div className="flex h-12 w-full cursor-grab p-4" onMouseDown={handleMouseDown}>
        <CardTitle className="select-none">{name}</CardTitle>
      </div>
      <div className="max-w-full flex-1 overflow-y-auto overflow-x-hidden">{children}</div>
    </Card>
  );
};

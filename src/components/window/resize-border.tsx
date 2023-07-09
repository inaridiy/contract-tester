import { memo, useMemo } from "react";

import { cn } from "@/lib/utils";

import { calculateGrid } from "./utils";
import { useWindowStore, WindowStoreState } from "./window-store";

export interface WindowResizeBorderProps {
  className?: string;
  grid?: WindowStoreState["grid"];
  gridX?: number;
  gridY?: number;
}

//eslint-disable-next-line
export const WindowResizeBorder: React.FC<WindowResizeBorderProps> = memo(
  ({ gridX = 0, gridY = 0, grid, className }) => {
    const container = useWindowStore((state) => state.container);
    const windows = useWindowStore((state) => state.windows);

    const [width, height, left, top] = useMemo(() => {
      if (!container || !windows) return [0, 0, 0, 0];
      const pos = { x: gridX, y: gridY };
      const { width, height, left, top } = calculateGrid(container, windows, grid || null, pos);
      return [width, height, left, top];
    }, [container, windows, grid, gridX, gridY]);

    const style = useMemo(
      () => ({
        width,
        height,
        left,
        top,
      }),
      [width, height, left, top],
    );

    return (
      <div
        style={style}
        className={cn("absolute rounded-lg z-10 border-4 border-dotted", className)}
      />
    );
  },
);

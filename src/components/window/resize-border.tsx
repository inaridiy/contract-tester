import { memo, useMemo } from "react";

import { cn } from "@/lib/utils";

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
      const { width, height } = container;

      const findWindow = ([gridX, gridY]: [number, number]) => {
        const key = grid?.items[gridY]?.[gridX];
        if (!grid) return null;
        if (gridX < 0 || gridY < 0 || gridX >= grid.cols || gridY >= grid.rows) return null;
        if (!key) return null;
        return windows[key];
      };

      const [top, left, right, bottom] = [
        findWindow([gridX, gridY - 1]),
        findWindow([gridX - 1, gridY]),
        findWindow([gridX + 1, gridY]),
        findWindow([gridX, gridY + 1]),
      ];

      const baseWidth = width / (grid?.cols || 1);
      const baseHeight = height / (grid?.rows || 1);

      const gridWidth =
        right && left
          ? right.left - left.left - left.width
          : top || bottom
          ? top?.width || bottom?.width
          : baseWidth;
      const gridHeight =
        top && bottom
          ? bottom.top - top.top - top.height
          : left || right
          ? left?.height || right?.height
          : baseHeight;
      const gridLeft = left ? left.left + left.width : gridX * baseWidth;
      const gridTop = top ? top.top + top.height : gridY * baseHeight;

      console.log(gridWidth, gridHeight, gridLeft, gridTop);

      return [gridWidth, gridHeight, gridLeft, gridTop];
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

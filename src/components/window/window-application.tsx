"use client";

import { XIcon } from "lucide-react";
import { memo, useCallback, useEffect, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { ResizeHandler } from "./resize-handler";
import { calculateGrid, isInGrid, removeGrid } from "./utils";
import { WindowStoreState, useWindowStore } from "./window-store";

export interface WindowApplicationProps {
  windowKey: string;
  name?: string;
  className?: string;
  children?: React.ReactNode;
  minWidth?: number;
  minHeight?: number;
}

//eslint-disable-next-line
export const WindowApplication: React.FC<WindowApplicationProps> = memo(
  ({ windowKey: key, name, className, children, minWidth = 100, minHeight = 100 }) => {
    const container = useWindowStore((state) => state.container);
    const grid = useWindowStore((state) => state.grid);
    const position = useWindowStore((state) => state.windows[key]);
    const toTopWindow = useWindowStore((state) => state.toTopWindow);
    const updateWindow = useWindowStore((state) => state.updateWindow);
    const resizeWindow = useWindowStore((state) => state.resizeWindow);
    const closeWindow = useWindowStore((state) => state.closeWindow);
    const setGrid = useWindowStore((state) => state.setGrid);
    const setResizeGridBorder = useWindowStore((state) => state.setResizeGridBorder);

    const style = useMemo(
      () =>
        position && container
          ? {
              top: position.top,
              left: position.left,
              width: position.width,
              height: position.height,
              zIndex: position.zIndex,
              display: position.hidden ? "none" : "block",
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
        let resizeGridBorder: WindowStoreState["resizeGridBorder"] = null;

        toTopWindow(key);

        const handleMouseMove = (e: MouseEvent) => {
          const { clientX: x, clientY: y } = e;
          const newTop = Math.max(
            0,
            Math.min(container.height - position.height, top + y - clientY),
          );
          const newLeft = Math.max(
            0,
            Math.min(container.width - position.width, left + x - clientX),
          );
          updateWindow(key, { ...position, top: newTop, left: newLeft });
          // isInGrid(grid, key) && setGrid(removeGrid(grid, key));
          toTopWindow(key);

          const edgeX = newLeft === 0 ? 0 : newLeft === container.width - position.width ? 1 : null;
          const edgeY = newTop === 0 ? 0 : newTop === container.height - position.height ? 1 : null;

          if ((grid?.mode === "2x1" || !grid) && edgeX !== null && edgeY === null) {
            resizeGridBorder = {
              grid: { mode: "2x1", items: grid?.items || [[], []] },
              ...{ gridX: edgeX, gridY: 0 },
            };
            setResizeGridBorder(resizeGridBorder);
          } else if ((grid?.mode === "2x2" || !grid) && edgeX !== null && edgeY !== null) {
            resizeGridBorder = {
              grid: { mode: "2x2", items: grid?.items || [[], []] },
              ...{ gridX: edgeX, gridY: edgeY },
            };
            setResizeGridBorder(resizeGridBorder);
          } else {
            resizeGridBorder = null;
            setResizeGridBorder(null);
          }
        };

        const handleMouseUp = () => {
          window.removeEventListener("mousemove", handleMouseMove);
          window.removeEventListener("mouseup", handleMouseUp);
          if (resizeGridBorder) {
            const { grid, gridX, gridY } = resizeGridBorder;
            const gridPosition = calculateGrid(
              container,
              useWindowStore.getState().windows, //ちょっとしたパフォーマンス改善黒魔術
              grid,
              { x: gridX, y: gridY },
            );
            grid.items ??= [];
            grid.items[gridY] ??= [];
            grid.items[gridY][gridX] = key;
            console.log(grid, gridX, gridY);
            setGrid({ ...grid });
            updateWindow(key, { ...position, ...gridPosition });
            toTopWindow(key);
          }
          setResizeGridBorder(null);
        };
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
      },
      [key, position, container, grid, updateWindow, toTopWindow, setGrid, setResizeGridBorder],
    );

    const handleResize = useCallback(
      (diff: { width: number; height: number; top: number; left: number }) => {
        if (!position) return;
        const { width, height, top, left } = position;

        resizeWindow(key, {
          ...position,
          width: width + diff.width,
          height: height + diff.height,
          top: top + diff.top,
          left: left + diff.left,
        });
      },
      [key, position, resizeWindow],
    );

    const handleClose = useCallback(() => {
      closeWindow(key);
    }, [key, closeWindow]);

    useEffect(() => {
      updateWindow(key, {
        ...{ left: 0, top: 0, width: 400, height: 300 },
        ...{ minHeight, minWidth },
        ...{ zIndex: 0, hidden: false },
      });

      return () => closeWindow(key);
    }, [key, closeWindow, updateWindow, minHeight, minWidth]);

    return (
      <Card
        style={style}
        className={cn("absolute overflow-hidden flex flex-col", className)}
        onClick={() => toTopWindow(key)}
      >
        <ResizeHandler onResize={handleResize} />
        <div
          className="flex h-12 w-full cursor-grab items-center gap-2 px-4"
          onMouseDown={handleMouseDown}
        >
          <CardTitle className="select-none">{name}</CardTitle>
          <div className="flex-1" />

          <Button
            variant="outline"
            size="icon"
            className="hover:text-destructive"
            onClick={handleClose}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="h-full max-w-full overflow-y-auto overflow-x-hidden pb-12">{children}</div>
      </Card>
    );
  },
);

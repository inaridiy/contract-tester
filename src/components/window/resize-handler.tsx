import { useCallback, memo } from "react";

export interface ResizeHandlerProps {
  onResize: (diff: { width: number; height: number; top: number; left: number }) => void;
}

//eslint-disable-next-line
export const ResizeHandler: React.FC<ResizeHandlerProps> = memo(({ onResize }) => {
  const handleX = useCallback(
    (cb: (x: number, y: number) => void) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      const { clientX, clientY } = e;
      const handleMouseMove = (e: MouseEvent) => cb(e.clientX - clientX, e.clientY - clientY);
      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [],
  );

  const handleTop = handleX((_, y) => onResize({ width: 0, height: -y, top: y, left: 0 }));
  const handleBottom = handleX((_, y) => onResize({ width: 0, height: y, top: 0, left: 0 }));
  const handleLeft = handleX((x, _) => onResize({ width: -x, height: 0, top: 0, left: x }));
  const handleRight = handleX((x, _) => onResize({ width: x, height: 0, top: 0, left: 0 }));

  const handleLeftTop = handleX((x, y) => onResize({ width: -x, height: -y, top: y, left: x }));
  const handleLeftBottom = handleX((x, y) => onResize({ width: -x, height: y, top: 0, left: x }));
  const handleRightTop = handleX((x, y) => onResize({ width: x, height: -y, top: y, left: 0 }));
  const handleRightBottom = handleX((x, y) => onResize({ width: x, height: y, top: 0, left: 0 }));

  return (
    <>
      <div
        className="absolute left-0 top-0 z-20 h-2 w-full cursor-ns-resize"
        onMouseDown={handleTop}
      />
      <div
        className="absolute bottom-0 left-0 z-20 h-2 w-full cursor-ns-resize"
        onMouseDown={handleBottom}
      />
      <div
        className="absolute left-0 top-0 z-20 h-full w-2 cursor-ew-resize"
        onMouseDown={handleLeft}
      />
      <div
        className="absolute right-0 top-0 z-20 h-full w-2 cursor-ew-resize"
        onMouseDown={handleRight}
      />

      <div
        className="absolute left-0 top-0 z-20 h-4 w-4 cursor-nwse-resize"
        onMouseDown={handleLeftTop}
      />
      <div
        className="absolute bottom-0 left-0 z-20 h-4 w-4 cursor-nesw-resize"
        onMouseDown={handleLeftBottom}
      />
      <div
        className="absolute bottom-0 right-0 z-20 h-4 w-4 cursor-nwse-resize"
        onMouseDown={handleRightBottom}
      />
      <div
        className="absolute right-0 top-0 z-20 h-4 w-4 cursor-nesw-resize"
        onMouseDown={handleRightTop}
      />
    </>
  );
});

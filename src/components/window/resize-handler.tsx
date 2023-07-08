import { useCallback } from "react";

export interface ResizeHandlerProps {
  onResize: (diff: { width: number; height: number; top: number; left: number }) => void;
}

export const ResizeHandler: React.FC<ResizeHandlerProps> = ({ onResize }) => {
  const handleLeftTop = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      const { clientX, clientY } = e;
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX: x, clientY: y } = e;
        onResize({
          width: -(x - clientX),
          height: -(y - clientY),
          top: y - clientY,
          left: x - clientX,
        });
      };
      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [onResize],
  );

  const handleLeftBottom = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      const { clientX, clientY } = e;
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX: x, clientY: y } = e;
        onResize({ width: -(x - clientX), height: y - clientY, top: 0, left: x - clientX });
      };
      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [onResize],
  );

  const handleRightTop = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      const { clientX, clientY } = e;
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX: x, clientY: y } = e;
        onResize({ width: x - clientX, height: -(y - clientY), top: y - clientY, left: 0 });
      };
      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [onResize],
  );

  const handleRightBottom = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      const { clientX, clientY } = e;
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX: x, clientY: y } = e;
        onResize({ width: x - clientX, height: y - clientY, top: 0, left: 0 });
      };
      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [onResize],
  );

  return (
    <>
      <div
        className="absolute left-0 top-0 z-10 h-4 w-4 cursor-nwse-resize"
        onMouseDown={handleLeftTop}
      />
      <div
        className="absolute bottom-0 left-0 z-10 h-4 w-4 cursor-nesw-resize"
        onMouseDown={handleLeftBottom}
      />
      <div
        className="absolute bottom-0 right-0 z-10 h-4 w-4 cursor-nwse-resize"
        onMouseDown={handleRightBottom}
      />
      <div
        className="absolute right-0 top-0 z-10 h-4 w-4 cursor-nesw-resize"
        onMouseDown={handleRightTop}
      />
    </>
  );
};

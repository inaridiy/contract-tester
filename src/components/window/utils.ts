export const getDivPosition = (div: HTMLDivElement) => {
  const width = div.offsetWidth;
  const height = div.offsetHeight;
  const { left, top } = div.getBoundingClientRect();
  return { width, height, left, top };
};

export const listenDivPosition = (
  div: HTMLDivElement,
  callback: (position: { width: number; height: number; left: number; top: number }) => void,
) => {
  const observer = new ResizeObserver(() => {
    callback(getDivPosition(div));
  });
  observer.observe(div);
  return () => {
    observer.disconnect();
  };
};

export const calculateGrid = (
  container: { width: number; height: number },
  windows: { [key: string]: { width: number; height: number; top: number; left: number } },
  grid: { mode: "2x1" | "2x2"; items: string[][] } | null,
  position: { x: number; y: number },
) => {
  const { width, height } = container;
  const { x, y } = position;

  const findWindow = ([gridX, gridY]: [number, number]) => {
    const key = grid?.items[gridY]?.[gridX];
    if (!grid || !key) return null;
    return windows[key];
  };

  const [top, left, right, bottom] = [
    findWindow([x, y - 1]),
    findWindow([x - 1, y]),
    findWindow([x + 1, y]),
    findWindow([x, y + 1]),
  ];

  const baseWidth = grid ? width / 2 : width;
  const baseHeight = grid?.mode === "2x2" ? height / 2 : height;

  const gridWidth = left
    ? width - left.width
    : right
    ? width - right.width
    : bottom?.width || baseWidth;
  const gridHeight = top
    ? height - top.height
    : bottom
    ? height - bottom.height
    : right?.height || baseHeight;
  const gridLeft = x === 0 ? 0 : left ? left.width : width - gridWidth;
  const gridTop = y === 0 ? 0 : top ? top.height : height - gridHeight;

  return { width: gridWidth, height: gridHeight, left: gridLeft, top: gridTop };
};

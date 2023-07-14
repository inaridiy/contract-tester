import { WindowStoreState, useWindowStore } from "./window-store";

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
    : bottom?.width || top?.width || baseWidth;
  const gridHeight = top
    ? height - top.height
    : bottom
    ? height - bottom.height
    : right?.height || left?.height || baseHeight;
  const gridLeft = x === 0 ? 0 : left ? left.width : width - gridWidth;
  const gridTop = y === 0 ? 0 : top ? top.height : height - gridHeight;

  return { width: gridWidth, height: gridHeight, left: gridLeft, top: gridTop };
};

export const isInGrid = (grid: WindowStoreState["grid"], key: string) => {
  if (!grid) return false;
  return grid.items.some((row) => row.includes(key));
};

export const removeGrid = (grid: WindowStoreState["grid"], key: string) => {
  if (!grid) return null;
  const items = grid.items.map((row) => row.filter((item) => item !== key));
  return { ...grid, items };
};

export const gridPosition = (grid: WindowStoreState["grid"], key: string) => {
  if (!grid || !isInGrid(grid, key)) return null;
  const y = grid.items.findIndex((row) => row.includes(key));
  const x = grid.items[y].findIndex((item) => item === key);
  return { x, y };
};

export const getGridItemAdjacent = (
  grid: WindowStoreState["grid"],
  key: string,
): { up?: string; left?: string; right?: string; down?: string } => {
  if (!grid || !isInGrid(grid, key)) return {};
  const { x, y } = gridPosition(grid, key) || {};
  if (x === undefined || y === undefined) return {};
  return {
    up: grid.items[y - 1]?.[x],
    left: grid.items[y]?.[x - 1],
    right: grid.items[y]?.[x + 1],
    down: grid.items[y + 1]?.[x],
  };
};

export const getWindowTricky = (key: string) => {
  const position = useWindowStore.getState().windows[key];
  if (!position) return null;
  return { ...position, key };
};

export const getGridAdjacentWindows = (
  grid: WindowStoreState["grid"],
  windows: WindowStoreState["windows"],
  key: string,
) => {
  const { up, left, right, down } = getGridItemAdjacent(grid, key);
  return {
    up: up !== undefined ? { ...windows[up], key: up } : undefined,
    left: left !== undefined ? { ...windows[left], key: left } : undefined,
    right: right !== undefined ? { ...windows[right], key: right } : undefined,
    down: down !== undefined ? { ...windows[down], key: down } : undefined,
  };
};

export const getMaxWindowSize = (
  container: WindowStoreState["container"],
  adjacent: ReturnType<typeof getGridAdjacentWindows>,
) => {
  if (!container) return null;

  const maxWidth =
    adjacent.right || adjacent.left
      ? container.width - Math.max(adjacent?.right?.minWidth || 0, adjacent?.left?.minWidth || 0)
      : container.width;

  const maxHeight =
    adjacent?.up || adjacent?.down
      ? container.height - Math.max(adjacent?.up?.minHeight || 0, adjacent?.down?.minHeight || 0)
      : container.height;

  return { maxWidth, maxHeight };
};

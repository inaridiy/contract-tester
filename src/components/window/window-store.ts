import { create } from "zustand";

import { inRange } from "@/lib/utils";

import { getGridAdjacentWindows, getGridPosition, getMaxWindowSize } from "./utils";

export interface WindowStoreState {
  container: {
    width: number;
    height: number;
    top: number;
    left: number;
  } | null;
  grid: {
    mode: "2x1" | "2x2";
    items: string[][]; // x, y
  } | null;
  resizeGridBorder: {
    grid: {
      mode: "2x1" | "2x2";
      items: string[][]; // x, y
    };
    gridX: number;
    gridY: number;
  } | null;
  windows: {
    [key: string]: {
      width: number;
      height: number;
      top: number;
      left: number;
      minWidth: number;
      minHeight: number;
      zIndex: number;
      hidden: boolean;
    };
  };
}

export interface WindowStoreActions {
  setContainer: (container: WindowStoreState["container"]) => void;
  resizeContainer: (container: WindowStoreState["container"]) => void;
  setGrid: (grid: WindowStoreState["grid"]) => void;
  setResizeGridBorder: (grid: WindowStoreState["resizeGridBorder"]) => void;
  toTopWindow: (id: string) => void;
  updateWindow: (id: string, window: WindowStoreState["windows"][string]) => void;
  resizeWindow: (id: string, window: WindowStoreState["windows"][string]) => void;
  closeWindow: (id: string) => void;
}

export const useWindowStore = create<WindowStoreState & WindowStoreActions>((set) => ({
  container: null,
  resizeGridBorder: null,
  grid: null,
  windows: {},
  setContainer: (container) => set((state) => ({ ...state, container })),
  setResizeGridBorder: (grid) => set((state) => ({ ...state, resizeGridBorder: grid })),
  resizeContainer: (container) =>
    set((state) => {
      if (!container || !state.container) return { ...state };
      const { width: containerWidth, height: containerHeight } = container;
      const { width: oldWidth, height: oldHeight } = state.container;
      const updatedWindows = { ...state.windows };

      for (const [id, window] of Object.entries(updatedWindows)) {
        const isInGrid = state.grid?.items.some((row) => row.includes(id));

        if (isInGrid) {
          const { width, height, top, left } = window;
          window.width = (containerWidth / oldWidth) * width;
          window.height = (containerHeight / oldHeight) * height;
          window.top = (containerHeight / oldHeight) * top;
          window.left = (containerWidth / oldWidth) * left;
        }

        if (window.left + window.width > containerWidth)
          window.left = containerWidth - window.width;
        if (window.top + window.height > containerHeight)
          window.top = containerHeight - window.height;

        updatedWindows[id] = window;
      }

      return {
        ...state,
        container,
        windows: updatedWindows,
      };
    }),
  setGrid: (grid) => set((state) => ({ ...state, grid })),
  toTopWindow: (id) =>
    set((state) => {
      const window = state.windows[id];
      if (!window) return { ...state };
      const newWindow = { ...window };
      const maxZIndex = Math.max(0, ...Object.values(state.windows).map((window) => window.zIndex));
      if (window.zIndex <= maxZIndex) newWindow.zIndex = maxZIndex + 1;
      return { ...state, windows: { ...state.windows, [id]: newWindow } };
    }),
  updateWindow: (id, window) =>
    set((state) => ({ ...state, windows: { ...state.windows, [id]: window } })),
  resizeWindow: (id, window) =>
    set((state) => {
      const container = state.container;
      const oldWindow = state.windows[id];
      const windows = { ...state.windows };
      const grid = state.grid;
      if (!container) return state;
      const adjacent = getGridAdjacentWindows(grid, windows, id);
      const maxSize = getMaxWindowSize(container, adjacent);
      const gridPos = getGridPosition(grid, id);
      const temp = gridPos ? { x: gridPos.x, y: gridPos.y } : { x: 0, y: 0 };
      const revTemp = gridPos ? { x: gridPos.x ? 0 : 1, y: gridPos.y ? 0 : 1 } : { x: 0, y: 0 };

      const diff = {
        width: window.width - oldWindow.width,
        height: window.height - oldWindow.height,
        top: window.top - oldWindow.top,
        left: window.left - oldWindow.left,
      };

      if (adjacent.up) {
        const { key, ...rest } = adjacent.up;
        windows[key] = {
          ...rest,
          left: rest.left + diff.left * temp.x,
          width: rest.width + diff.width,
          height: rest.height + diff.top,
        };
      }
      if (adjacent.down) {
        const { key, ...rest } = adjacent.down;
        windows[key] = {
          ...rest,
          left: rest.left + diff.left * temp.x,
          width: rest.width + diff.width,
          top: rest.top + diff.height,
          height: rest.height - diff.height,
        };
      }
      if (adjacent.left) {
        const { key, ...rest } = adjacent.left;
        windows[key] = {
          ...rest,
          width: rest.width + diff.left,
          top: rest.top + diff.top * temp.y,
          height: rest.height + diff.height,
        };
      }
      if (adjacent.right) {
        const { key, ...rest } = adjacent.right;
        windows[key] = {
          ...rest,
          left: rest.left + diff.width,
          width: rest.width - diff.width,
          top: rest.top + diff.top * temp.y,
          height: rest.height + diff.height,
        };
      }
      if (adjacent.opposite) {
        const { key, ...rest } = adjacent.opposite;

        windows[key] = {
          ...rest,
          left: rest.left + diff.width * revTemp.x,
          width: rest.width - diff.width,
          top: rest.top + diff.height * revTemp.y,
          height: rest.height - diff.height,
        };
      }

      windows[id] = {
        ...window,
        width: inRange(window.width, window.minWidth, maxSize?.maxWidth || Infinity),
        height: inRange(window.height, window.minHeight, maxSize?.maxHeight || Infinity),
        top: inRange(window.top, 0, container.height - window.height),
        left: inRange(window.left, 0, container.width - window.width),
      };

      return { ...state, windows: { ...windows } };
    }),
  closeWindow: (id) =>
    set(({ windows: { [id]: undefined, ...windows }, ...state }) => ({
      ...state,
      windows: { ...windows },
    })),
}));

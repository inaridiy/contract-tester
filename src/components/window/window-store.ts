import { create } from "zustand";

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
      if (!container) return { ...state };
      const { width, height } = container;
      const updatedWindows = { ...state.windows };
      for (const [id, window] of Object.entries(updatedWindows)) {
        if (window.left + window.width > width) {
          window.left = width - window.width;
        }
        if (window.top + window.height > height) {
          window.top = height - window.height;
        }
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
  closeWindow: (id) =>
    set(({ windows: { [id]: undefined, ...windows }, ...state }) => ({
      ...state,
      windows: { ...windows },
    })),
}));

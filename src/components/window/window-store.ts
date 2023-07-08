import { create } from "zustand";

export interface WindowStoreState {
  container: {
    width: number;
    height: number;
    top: number;
    left: number;
  } | null;

  windows: {
    [key: string]: {
      width: number;
      height: number;
      top: number;
      left: number;
      zIndex: number;
    };
  };
}

export interface WindowStoreActions {
  setContainer: (container: WindowStoreState["container"]) => void;
  toTopWindow: (id: string) => void;
  updateWindow: (id: string, window: WindowStoreState["windows"][string]) => void;
  closeWindow: (id: string) => void;
}

export const useWindowStore = create<WindowStoreState & WindowStoreActions>((set) => ({
  container: null,
  windows: {},
  setContainer: (container) => set((state) => ({ ...state, container })),
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

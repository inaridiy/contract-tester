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
  updateWindow: (id: string, window: WindowStoreState["windows"][string]) => void;
  closeWindow: (id: string) => void;
}

export const useWindowStore = create<WindowStoreState & WindowStoreActions>((set) => ({
  container: null,
  windows: {},
  setContainer: (container) => set((state) => ({ ...state, container })),
  updateWindow: (id, window) =>
    set((state) => ({ ...state, windows: { ...state.windows, [id]: window } })),
  closeWindow: (id) =>
    set(({ windows: { [id]: undefined, ...windows }, ...state }) => ({
      ...state,
      windows: { ...windows },
    })),
}));

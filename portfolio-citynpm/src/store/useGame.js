import { create } from 'zustand'

// Central game state shared between the 3D world and the React UI.
export const useGame = create((set) => ({
  // id of the building the player is currently standing next to (or null)
  nearBuilding: null,
  setNearBuilding: (id) =>
    set((s) => (s.nearBuilding === id ? s : { nearBuilding: id })),

  // id of the building whose info panel is open (or null)
  openBuilding: null,
  open: (id) => set({ openBuilding: id }),
  close: () => set({ openBuilding: null }),

  // whether the player has started (hides the intro overlay)
  started: false,
  start: () => set({ started: true }),

  // pointer-lock / camera-control active
  locked: false,
  setLocked: (v) => set({ locked: v }),

  // time of day: 'night' (default warm-lit) or 'day' (sun + reflections)
  mode: 'night',
  toggleMode: () => set((s) => ({ mode: s.mode === 'night' ? 'day' : 'night' })),
}))

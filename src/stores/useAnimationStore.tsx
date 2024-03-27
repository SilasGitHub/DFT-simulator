import {create} from "zustand"

export type AnimationState = "stopped" | "playing" | "paused";

interface AnimationStateStore {
    selectedIds: string[]
    addSelectedIds: (ids: string[]) => void
    removeSelectedIds: (ids: string[]) => void
    setSelectedIds: (ids: string[]) => void
    animationState: AnimationState
    setAnimationState: (animationState: AnimationState) => void
}

export const useAnimationStore = create<AnimationStateStore>()(
    (set) => ({
        selectedIds: [],
        addSelectedIds: (ids) => set((state) => ({selectedIds: [...state.selectedIds, ...ids]})),
        removeSelectedIds: (ids) => set((state) => ({selectedIds: state.selectedIds.filter((selectedId) => !ids.includes(selectedId))})),
        setSelectedIds: (ids) => set({selectedIds: ids}),
        animationState: "stopped",
        setAnimationState: (animationState) => set({animationState}),
    }),
)
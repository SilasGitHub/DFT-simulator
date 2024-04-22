import {create} from "zustand"

export type AnimationState = "stopped" | "playing" | "paused";
export type FailState = null | number

type NodesState = {
    [nodeId: string]: {
        failed: FailState
        beingUsedBy: string | null
    }
}

type EdgesState = {
    [edgeId: string]: {
        failed: FailState
    }
}

type DiagramAnimationStore = {
    // diagram state stuff
    nodesState: NodesState;
    edgesState: EdgesState;
    getNodeFailState: (nodeId: string) => FailState
    getNodeBeingUsedBy: (nodeId: string) => string | null
    setNodeFailState: (nodeId: string, failed: FailState) => void
    setNodeBeingUsedBy: (nodeId: string, beingUsedBy: string | null) => void
    getEdgeFailState: (edgeId: string) => FailState
    setEdgeFailState: (edgeId: string, failed: FailState) => void
    clearAnimationState: () => void
    // non-persistent animation stuff
    selectedToFailIds: string[]
    addSelectedToFailIds: (ids: string[]) => void
    removeSelectedToFailIds: (ids: string[]) => void
    setSelectedToFailIds: (ids: string[]) => void
    animationState: AnimationState
    isUiLocked: boolean
    setAnimationState: (animationState: AnimationState) => void
};

export const useDiagramAnimationStore = create<DiagramAnimationStore>()(
    (set, get) => ({
        nodesState: {},
        edgesState: {},
        getNodeFailState: (nodeId) => {
            const result = get().nodesState[nodeId]
            if (result === undefined) {
                return null
            }
            return result.failed
        },
        getNodeBeingUsedBy: (nodeId) => {
            const result = get().nodesState[nodeId]
            if (result === undefined) {
                return null
            }
            return result.beingUsedBy
        },
        setNodeFailState: (nodeId, failed) => set((state) => ({
            nodesState: {
                ...state.nodesState,
                [nodeId]: {
                    ...state.nodesState[nodeId],
                    failed,
                }
            },
        })),
        setNodeBeingUsedBy: (nodeId, beingUsedBy) => set((state) => ({
            nodesState: {
                ...state.nodesState,
                [nodeId]: {
                    ...state.nodesState[nodeId],
                    beingUsedBy,
                }
            },
        })),
        getEdgeFailState: (edgeId) => {
            const result = get().edgesState[edgeId]
            if (result === undefined) {
                return null
            }
            return result.failed
        },
        setEdgeFailState: (edgeId, failed) => set((state) => ({
            edgesState: {
                ...state.edgesState,
                [edgeId]: {
                    ...state.edgesState[edgeId],
                    failed,
                }
            },
        })),
        clearAnimationState: () => set({
            nodesState: {},
            edgesState: {},
        }),
        // animation stuff
        selectedToFailIds: [],
        addSelectedToFailIds: (ids) => set((state) => ({selectedToFailIds: [...state.selectedToFailIds, ...ids]})),
        removeSelectedToFailIds: (ids) => set((state) => ({selectedToFailIds: state.selectedToFailIds.filter((selectedId) => !ids.includes(selectedId))})),
        setSelectedToFailIds: (ids) => set({selectedToFailIds: ids}),
        animationState: "stopped",
        isUiLocked: false,
        setAnimationState: (animationState) => set({
            animationState,
            isUiLocked: animationState !== "stopped",
        }),
    }),
)

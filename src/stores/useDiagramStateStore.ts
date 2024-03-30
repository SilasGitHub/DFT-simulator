import {create} from "zustand"
import {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    addEdge,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    applyNodeChanges,
    applyEdgeChanges, getOutgoers, getIncomers,
} from "reactflow"
import {createNodeId, parseHandleId} from "../utils/idParser.ts"
import {NodeUnion} from "../components/nodes/Nodes.ts"
import {persist} from "zustand/middleware"

enum NodeType {
    SYSTEM_NODE = "SYSTEM_NODE",
    EVENT_NODE = "EVENT_NODE",

    AND_NODE = "AND_NODE",
    OR_NODE = "OR_NODE",
    XOR_NODE = "XOR_NODE",

    PAND_NODE = "PAND_NODE",
    FDEP_NODE = "FDEP_NODE",
    SPARE_NODE = "SPARE_NODE",
}


export type AnimationState = "stopped" | "playing" | "paused";

export type NodeData = {
    color: string;
};

export type DiagramStateStore = {
    // diagram state stuff
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    setNodes: (fn: (nodes: Node[]) => Node[]) => void;
    setEdges: (fn: (edges: Edge[]) => Edge[]) => void;
    addNode: (node: Node) => void;
    clearDiagram: () => void;
    // custom getters to improve use of reactflow
    getNodeById: <T extends Node>(id: string | null | undefined) => T | null;
    getOutgoingNodesAndEdges: (node: Node) => { outgoingNodes: Node[], outgoingEdges: Edge[] };
    getIncomingEdges: (node: Node) => Edge[];
    getChildren: (node: Node) => Node[];
    // animation stuff
    selectedIds: string[]
    addSelectedIds: (ids: string[]) => void
    removeSelectedIds: (ids: string[]) => void
    setSelectedIds: (ids: string[]) => void
    animationState: AnimationState
    isUiLocked: boolean
    setAnimationState: (animationState: AnimationState) => void
};

const screenCenter = {x: window.innerWidth / 2, y: window.innerHeight / 2}

const initialNodes: Node[] = [
    // initial system node
    {
        id: createNodeId(NodeType.SYSTEM_NODE),
        data: {failed: null, label: "SYS"},
        position: {x: screenCenter.x - 25, y: screenCenter.y - 25},
        selectable: false,
        type: NodeType.SYSTEM_NODE,
    } as NodeUnion,
]

// this is our useStore hook that we can use in our components to get parts of the store and call actions
export const useDiagramStateStore = create<DiagramStateStore>()(
    persist(
        (set, get) => ({
            nodes: initialNodes,
            edges: [],
            onNodesChange: (changes: NodeChange[]) => set({nodes: applyNodeChanges(changes, get().nodes)}),
            onEdgesChange: (changes: EdgeChange[]) => set({edges: applyEdgeChanges(changes, get().edges)}),
            onConnect: (connection: Connection) => set({edges: addEdge(connection, get().edges)}),
            setNodes: (fn: (nodes: Node[]) => Node[]) => set({nodes: fn(get().nodes)}),
            setEdges: (fn: (edges: Edge[]) => Edge[]) => set({edges: fn(get().edges)}),
            addNode: (node: Node) => {
                const disabledNodes = get().nodes.map((n) => {
                    n.selected = false
                    return n
                })
                return set({nodes: [...disabledNodes, node]})
            },
            clearDiagram: () => {
                if (confirm("Are you sure you want to clear the diagram?")) {
                    set({
                        nodes: initialNodes,
                        edges: [],
                        selectedIds: [],
                    })
                }
            },
            // custom getters to improve use of reactflow
            getNodeById: <T extends Node>(id: string | null | undefined) => {
                if (!id) {
                    return null
                }
                return get().nodes.find(node => node.id === id) as T
            },
            getOutgoingNodesAndEdges: (node: Node) => {
                const outgoingNodes = getOutgoers(node, get().nodes, get().edges).sort((a, b) => {
                    return a.position.x - b.position.x
                })
                const outgoingEdges = get().edges.filter(edge =>
                    (edge.source === node.id || edge.target === node.id)
                    && (outgoingNodes.map(n => n.id).includes(edge.target) || outgoingNodes.map(n => n.id).includes(edge.source)),
                )
                return {
                    outgoingEdges,
                    outgoingNodes: outgoingNodes as Node[],
                }
            },
            getIncomingEdges: (node: Node) => {
                return get().edges.filter(edge => edge.target === node.id).sort((a, b) => {
                    // TODO: handle number may not always == left to right. See https://github.com/SilasGitHub/DFT-simulator/issues/47
                    return (parseHandleId(a.targetHandle).number as number) - (parseHandleId(b.targetHandle).number as number)
                })
            },
            getChildren: (node: Node) => {
                const incomers = getIncomers(node, get().nodes, get().edges)
                incomers.sort((a, b) => {
                    const edgeA = get().edges.find(edge => edge.target === node.id && edge.source === a.id) as Edge
                    const edgeB = get().edges.find(edge => edge.target === node.id && edge.source === b.id) as Edge
                    return (parseHandleId(edgeA.targetHandle).number as number) - (parseHandleId(edgeB.targetHandle).number as number)
                })
                return incomers
            },
            // animation stuff
            selectedIds: [],
            addSelectedIds: (ids) => set((state) => ({selectedIds: [...state.selectedIds, ...ids]})),
            removeSelectedIds: (ids) => set((state) => ({selectedIds: state.selectedIds.filter((selectedId) => !ids.includes(selectedId))})),
            setSelectedIds: (ids) => set({selectedIds: ids}),
            animationState: "stopped",
            isUiLocked: false,
            setAnimationState: (animationState) => set({
                animationState,
                isUiLocked: animationState !== "stopped",
            }),
        }),
        {
            name: "diagram-state",
            // merge: (persistedState, currentState) => {
            //     return Object.assign(currentState, persistedState);
            // },
        },
    ),
)

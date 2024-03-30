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
    applyEdgeChanges,
    getOutgoers,
    getIncomers,
    ReactFlowInstance,
    Viewport,
    ViewportHelperFunctionOptions,
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

type DiagramStateStore = {
    // diagram state stuff
    nodes: NodeUnion[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    setNodes: (fn: (nodes: NodeUnion[]) => NodeUnion[]) => void;
    setEdges: (fn: (edges: Edge[]) => Edge[]) => void;
    addNode: (node: NodeUnion) => void;
    // custom getters to improve use of reactflow
    clearDiagram: () => void;
    getNodeById: <T extends NodeUnion>(id: string | null | undefined) => T | null;
    getOutgoingNodesAndEdges: (node: NodeUnion) => { outgoingNodes: NodeUnion[], outgoingEdges: Edge[] };
    getIncomingEdges: (node: NodeUnion) => Edge[];
    getChildren: (node: NodeUnion) => NodeUnion[];
    toJson: (rfInstance: ReactFlowInstance) => string;
    loadJson: (json: string, setViewport: (viewport: Viewport, options?: ViewportHelperFunctionOptions) => void) => void;
    // persistent animation stuff
    animationSpeed: number
    setAnimationSpeed: (speed: number) => void
};

const screenCenter = {x: window.innerWidth / 2, y: window.innerHeight / 2}

const initialNodes: NodeUnion[] = [
    // initial system node
    {
        id: createNodeId(NodeType.SYSTEM_NODE),
        data: {label: "SYS"},
        position: {x: screenCenter.x - 25, y: screenCenter.y - 25},
        selectable: false,
        type: NodeType.SYSTEM_NODE,
    },
]

export const useDiagramStateStore = create<DiagramStateStore>()(
    persist(
        (set, get) => ({
            nodes: initialNodes,
            edges: [],
            onNodesChange: (changes: NodeChange[]) => set({nodes: applyNodeChanges(changes, get().nodes) as NodeUnion[]}),
            onEdgesChange: (changes: EdgeChange[]) => set({edges: applyEdgeChanges(changes, get().edges)}),
            onConnect: (connection: Connection) => set({edges: addEdge(connection, get().edges)}),
            setNodes: (fn: (nodes: NodeUnion[]) => NodeUnion[]) => set({nodes: fn(get().nodes)}),
            setEdges: (fn: (edges: Edge[]) => Edge[]) => set({edges: fn(get().edges)}),
            addNode: (node: NodeUnion) => {
                const disabledNodes = get().nodes.map((n) => {
                    n.selected = false
                    return n
                })
                return set({nodes: [...disabledNodes, node]})
            },
            // custom getters to improve use of reactflow
            clearDiagram: () => {
                set({
                    nodes: initialNodes,
                    edges: [],
                })
            },
            getNodeById: <T extends NodeUnion>(id: string | null | undefined) => {
                if (!id) {
                    return null
                }
                return get().nodes.find(node => node.id === id) as T
            },
            getOutgoingNodesAndEdges: (node: NodeUnion) => {
                const outgoingNodes = getOutgoers(node, get().nodes, get().edges).sort((a, b) => {
                    return a.position.x - b.position.x
                })
                const outgoingEdges = get().edges.filter(edge =>
                    (edge.source === node.id || edge.target === node.id)
                    && (outgoingNodes.map(n => n.id).includes(edge.target) || outgoingNodes.map(n => n.id).includes(edge.source)),
                )
                return {
                    outgoingEdges,
                    outgoingNodes: outgoingNodes as NodeUnion[],
                }
            },
            getIncomingEdges: (node: NodeUnion) => {
                return get().edges.filter(edge => edge.target === node.id).sort((a, b) => {
                    // TODO: handle number may not always == left to right. See https://github.com/SilasGitHub/DFT-simulator/issues/47
                    return (parseHandleId(a.targetHandle).number as number) - (parseHandleId(b.targetHandle).number as number)
                })
            },
            getChildren: (node: NodeUnion) => {
                const incomers = getIncomers(node, get().nodes, get().edges)
                incomers.sort((a, b) => {
                    const edgeA = get().edges.find(edge => edge.target === node.id && edge.source === a.id) as Edge
                    const edgeB = get().edges.find(edge => edge.target === node.id && edge.source === b.id) as Edge
                    return (parseHandleId(edgeA.targetHandle).number as number) - (parseHandleId(edgeB.targetHandle).number as number)
                })
                return incomers as NodeUnion[]
            },
            toJson: (rfInstance: ReactFlowInstance) => {
                const flow = rfInstance.toObject()
                return JSON.stringify(flow, null, 2)
            },
            loadJson: async (json: string, setViewport: (viewport: Viewport, options?: ViewportHelperFunctionOptions) => void) => {
                const flow = JSON.parse(json)

                if (flow) {
                    set({
                        nodes: flow.nodes || [],
                        edges: flow.edges || [],
                    })
                    const {x = 0, y = 0, zoom = 1} = flow.viewport
                    setViewport({x, y, zoom})
                }
            },
            // persistent animation stuff
            animationSpeed: 1,
            setAnimationSpeed: (speed) => set({animationSpeed: speed}),
        }),
        {
            name: "diagram-state",
        },
    ),
)

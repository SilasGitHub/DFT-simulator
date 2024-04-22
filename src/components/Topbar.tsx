import {useDiagramStateStore} from "../stores/useDiagramStateStore.ts"
import TopbarButton from "./TopbarButton.tsx"
import React, {useCallback} from "react"
import {Edge, Node, ReactFlowInstance, useReactFlow} from "reactflow"
import {downloadFile} from "../utils/downloadFile.ts"
import TopbarSpeedChanger from "./TopbarSpeedChanger.tsx"
import {useDiagramAnimationStore} from "../stores/useDiagramAnimationStore.ts"
import {NodeUnion} from "./nodes/Nodes.ts"
import Dagre from "@dagrejs/dagre"


const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
const getLayoutedElements = (nodes: Node[], edges: Edge[], options: { direction: string; }) => {
    g.setGraph({rankdir: options.direction, ranker: "tight-tree"})

    edges.forEach((edge) => g.setEdge(edge.source, edge.target))
    nodes.forEach((node) => g.setNode(node.id, node as any)) // IS THIS CORRECT? (node as any)

    Dagre.layout(g)

    return {
        nodes: nodes.map((node) => {
            const {x, y} = g.node(node.id)

            return {...node, position: {x, y}}
        }) as NodeUnion[],
        edges,
    }
}

type TopBarProps = {
    reactFlowInstance: ReactFlowInstance | null
}

// Reorderable ids list based on this tutorial: https://dev.to/h8moss/build-a-reorderable-list-in-react-29on
export default function Topbar({reactFlowInstance}: TopBarProps) {
    const {clearDiagram, toJson, loadJson, setNodes, setEdges, nodes, edges} = useDiagramStateStore()
    const {animationState, setSelectedToFailIds} = useDiagramAnimationStore()
    const {setViewport, fitView} = useReactFlow()
    const loadDiagramInput = React.useRef<HTMLInputElement>(null)

    const onFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = () => {
            const json = reader.result as string
            loadJson(json, setViewport)
        }
        reader.readAsText(file)
    }, [loadJson, setViewport])

    const restoreDiagram = useCallback(() => {
        if (!loadDiagramInput.current) return
        loadDiagramInput.current.click()
    }, [loadDiagramInput])

    const saveDiagram = useCallback(() => {
        if (!reactFlowInstance) return

        const json = toJson(reactFlowInstance)
        downloadFile(json, `dfa-${new Date().toLocaleString().replace(", ", "-")}.dfts`, "application/json")
    }, [reactFlowInstance, toJson])

    const organizeLayout = useCallback((direction: string) => {
            const layouted = getLayoutedElements(nodes, edges, {direction})

            setNodes((_) => [...layouted.nodes])
            setEdges((_) => [...layouted.edges])

            window.requestAnimationFrame(() => {
                fitView()
            })
        },
        [nodes, edges, setNodes, setEdges, fitView],
    )

    return (
        <div id="topbar"
             className="flex items-center justify-between h-10 w-full bg-background-floating border-b-4 border-theme-border text-main"
        >
            {animationState === "stopped"
                ? <>
                    <div className="flex h-full">
                        <input
                            ref={loadDiagramInput}
                            onChange={onFileChange}
                            type="file"
                            accept=".dfts"
                            className="hidden"
                        />

                        <TopbarButton
                            onClick={restoreDiagram}
                        >
                            <div className="i-mdi-upload text-main"/>
                        </TopbarButton>
                        <TopbarButton
                            onClick={saveDiagram}
                        >
                            <div className="i-mdi-content-save text-main"/>
                        </TopbarButton>
                        <TopbarButton
                            onClick={() => {
                                if (confirm("Are you sure you want to clear the diagram?")) {
                                    setSelectedToFailIds([])
                                    clearDiagram()
                                }
                            }}
                        >
                            <div className="i-mdi-delete text-stop"/>
                        </TopbarButton>
                    </div>
                </>
                : <div className="ml-4">
                    Animation is running...
                </div>
            }
            <div className="flex h-full">
                <TopbarButton
                    className="border-l-2.5 border-r-none"
                    onClick={() => organizeLayout("BT")}
                >
                    <div className="i-mdi-auto-fix text-main"/>
                </TopbarButton>
                <TopbarSpeedChanger/>
            </div>
        </div>
    )
}
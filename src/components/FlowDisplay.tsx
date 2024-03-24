import React from "react"
import ReactFlow, {
    addEdge,
    Background,
    BackgroundVariant,
    Connection,
    Controls,
    getConnectedEdges,
    MiniMap,
    Node,
    ReactFlowInstance,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
} from "reactflow"
import "reactflow/dist/style.css"
import {EventNodeType, nodeMap, NodeType, NodeUnion} from "./nodes/Nodes.ts"

const initialNodes: NodeUnion[] = [
    // { id: '2', data: { label: 'A' }, position: { x: 100, y: 200 }, type: 'eventNode' },
    // { id: '1', data: { label: 'B' }, position: { x: 100, y: 200 }, type: 'orNode' },
    {id: "1", data: {failed: null, label: "SYS"}, position: {x: 100, y: 200}, type: NodeType.SYSTEM_NODE}
]

const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

let id = 0
const getId = () => `dndnode_${id++}`

interface FlowDisplayProps {
    selected: Array<string>,
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
	currentlyAnimating: boolean,
}

export default function FlowDisplay(props: FlowDisplayProps) {
    const reactFlowWrapper = React.useRef(null)
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const [reactFlowInstance, setReactFlowInstance] = React.useState(null as null | ReactFlowInstance)

    React.useCallback(() => {
        console.log(getConnectedEdges(nodes, edges))
    }, [nodes])

    const onConnect = React.useCallback((connection: Connection) => {
        setEdges((eds) => addEdge(connection, eds))
    }, [])

    const onDragOver = React.useCallback((event: React.DragEvent) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = "move"
    }, [])

    const onDrop = React.useCallback((event: React.DragEvent) => {
            event.preventDefault()
            if (reactFlowInstance === null) {
                return
            }

            const type = event.dataTransfer.getData("application/reactflow")

            // check if the dropped element is valid
            if (typeof type === "undefined" || !type) {
                return
            }
            // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
            // and you don't need to subtract the reactFlowBounds.left/top anymore
            // details: https://reactflow.dev/whats-new/2023-11-10
            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            })
            const newNode = {
                id: getId(),
                type,
                position,
                data: {label: `${alphabet[id % alphabet.length]}`},
            } as EventNodeType

            if (type === NodeType.EVENT_NODE) {
                newNode.data = {...newNode.data, failed: null}
                console.log(newNode)
            }

            setNodes((nds) => nds.concat(newNode))
        },
        [reactFlowInstance],
    )

    const onConnectWrap = (connection: Connection) => {
        onConnect(connection)
        // doUpdateFail(Date.now())
    }

    const onNodeClick = (_: React.MouseEvent, node: Node) => {
        if (node.type !== NodeType.EVENT_NODE) {
            return
        }

        // If we double click on a basic event node, select or unselect it from the list of events to fail
        if (props.selected.includes(node.id)) {
            props.setSelected(props.selected.filter((id) => id !== node.id))
        } else {
            props.setSelected(props.selected.concat([node.id]))
        }

        // Highlight the selected basic event by changing it's internal state to 'failed' which will update it's background color
        setNodes((nds) => {
            //doUpdateFail(Date.now());
            return nds.map((nd) => {
                if (nd.id === node.id) {
                    nd.data = {
                        ...nd.data,
                        failed: nd.data.failed === null ? null : !nd.data.failed,
                    }
                }
                return nd
            })
        })

    }

    return (
        <ReactFlowProvider>
            <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeMap}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onInit={setReactFlowInstance}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnectWrap}
                    onNodeClick={onNodeClick}
                >
                    <Controls/>
                    <MiniMap/>
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
                </ReactFlow>
            </div>
        </ReactFlowProvider>

    )
}
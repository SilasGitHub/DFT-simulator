import React, { useEffect } from "react"
import ReactFlow, {
    addEdge,
    Background,
    BackgroundVariant,
    Connection,
    Controls,
    Edge,
    getConnectedEdges,
    getIncomers,
    getOutgoers,
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

let running = false;

export default function FlowDisplay(props: FlowDisplayProps) {
    const reactFlowWrapper = React.useRef(null)
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const [reactFlowInstance, setReactFlowInstance] = React.useState(null as null | ReactFlowInstance)
	const [disabled, setDisabled] = React.useState(false);
    React.useCallback(() => {
        console.log(getConnectedEdges(nodes, edges))
    }, [nodes])
	let toFail = new Array<string>();
    const onConnect = React.useCallback((connection: Connection) => {
        setEdges((eds) => addEdge(connection, eds))
    }, [])

    const onDragOver = React.useCallback((event: React.DragEvent) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = "move"
    }, [])

	function resetAnimation() {
		setNodes(nodes.map(node => {
			node.data.failed = false;
			return node;
		}))
	}

	function getAdjacent(node : Node) : [edges : string[], nodes:string[]] {
		const adjacentNodes = getOutgoers(node, nodes, edges);
		const adjacentEdges = edges.filter(edge => (edge.sourceNode === node || edge.targetNode === node) && 
			(adjacentNodes.includes(edge.targetNode as Node) || adjacentNodes.includes(edge.sourceNode as Node)));
		return [adjacentEdges.map(edge => edge.id), adjacentNodes.map(node => node.id)]
	}

	function getChildren(node : Node) : Node[] {
		const result = getIncomers(node, nodes, edges);
		console.log(result);
		return result;
	}
	
	const doAnimate : any =() => {
        if (!running) {
            console.log("not running anymore")
			toFail = [];
            return;
        }

		console.log(toFail);
		if (toFail.length === 0) {
			toFail = [...props.selected];
			resetAnimation();
		} else {
			const nodeName = toFail.shift();
			const node = nodes.find(node => node.id === nodeName) as NodeUnion;
			console.log(node)
			switch (node.type) {
				case (NodeType.SYSTEM_NODE) : {
					setNodes(nodes.map(nd => {nd.data.failed = nd === node ? true : nd.data.failed; return nd;}))
					break;
				}
				case (NodeType.EVENT_NODE) : {
					setNodes(nodes.map(nd => {nd.data.failed = nd === node ? true : nd.data.failed; return nd;}))
					const [adjacentEdges, adjacentNodes] = getAdjacent(node);
					toFail = adjacentNodes.concat(toFail);
					break;
				}
				case (NodeType.AND_NODE) : {
					const children = getChildren(node);
					if (children.every(child => child.data.failed)) {
						setNodes(nodes.map(nd => {nd.data.failed = nd === node ? true : nd.data.failed; return nd;}))
						const [adjacentEdges, adjacentNodes] = getAdjacent(node);
						toFail = adjacentNodes.concat(toFail);
					} else {
						return doAnimate();
					}
					break;
				}
				default : {
					return;
				}
			}
		}
        console.log("Running:" + running)
        setTimeout(() => {
            doAnimate();
        }, 1000) 

    }

    useEffect(() => {
		running = props.currentlyAnimating;

		//Disable/enable interaction with the FlowDisplay
		setDisabled(running);
		if (!running) {
			setNodes(nodes.map(node => {
				node.data.failed = props.selected.includes(node.id) ? true : null; 
				return node;
			}))
			return;
		}


        if (running) {
            doAnimate();
        }
    }, [props.currentlyAnimating]);


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
                data: {label: `${alphabet[id % alphabet.length]}`, failed: null},
            } as EventNodeType

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
                        failed: nd.data.failed === null ? true : null,
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
					edgesUpdatable={!disabled}
					edgesFocusable={!disabled}
					nodesDraggable={!disabled}
					nodesConnectable={!disabled}
					nodesFocusable={!disabled}
					elementsSelectable={!disabled}
                >
                    <Controls/>
                    <MiniMap/>
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
                </ReactFlow>
            </div>
        </ReactFlowProvider>

    )
}
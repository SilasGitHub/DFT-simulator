import React, {useEffect} from "react"
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
    useEdgesState,
    useNodesState,
} from "reactflow"
import "reactflow/dist/style.css"
import {EventNodeType, nodeElementsMap, NodeType, NodeUnion} from "./nodes/Nodes.ts"
import {useNodeUtils} from "../utils/useNodeUtils.tsx"
import {parseHandleId} from "../utils/idParser.ts"

const initialNodes: NodeUnion[] = [
    // { id: '2', data: { label: 'A' }, position: { x: 100, y: 200 }, type: 'eventNode' },
    // { id: '1', data: { label: 'B' }, position: { x: 100, y: 200 }, type: 'orNode' },
    {id: "1", data: {failed: null, label: "SYS"}, position: {x: 100, y: 200}, type: NodeType.SYSTEM_NODE},
]

const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

let order = 1
let id = 0
const getId = () => `dndnode_${id++}`

interface FlowDisplayProps {
    selected: Array<string>,
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
    currentlyAnimating: boolean,
}

let running = false

export default function FlowDisplay(props: FlowDisplayProps) {
    const reactFlowWrapper = React.useRef(null)
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const [reactFlowInstance, setReactFlowInstance] = React.useState(null as null | ReactFlowInstance)
    const [disabled, setDisabled] = React.useState(false)
    const {getIncomingEdges, getOutgoingNodesAndEdges, getChildren, getNodeById} = useNodeUtils(nodes, edges)

    let toFail = new Array<string>()

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

    const resetAnimation = React.useCallback(() => {
        setNodes(nodes.map(node => {
            if ((node as NodeUnion).type === NodeType.EVENT_NODE && node.data.isSpare) {
                node.data.failed = null
                node.data.beingUsedBy = null
            } else {
                node.data.failed = 0
            }
            return node
        }))
    }, [nodes, setNodes])

    const doAnimate = React.useCallback(() => {
        if (!running) {
            console.log("not running anymore")
            toFail = []
            return
        }

		if (toFail.length === 0) {
			toFail = [...props.selected];
			resetAnimation();
		} else {
			const nodeName = toFail.shift();
			const node = getNodeById(nodeName)!
			let nextState : number;
			switch (node.type) {
				case (NodeType.SYSTEM_NODE) : {
					const children = getChildren(node);
					nextState = children.some(child => child.data.failed) ? order++ : 0;
					break;
				}
				case (NodeType.EVENT_NODE) : {
					nextState = order++;
					break;
				}
				case (NodeType.AND_NODE) : {
					const children = getChildren(node);
					nextState = children.every(child => child.data.failed) ? order++ : 0;
					break;
				}
				case (NodeType.OR_NODE) : {
					const children = getChildren(node);
					nextState = children.some(child => child.data.failed) ? order++ : 0;
					break;
				}
				case (NodeType.XOR_NODE) : {
					const children = getChildren(node);
					const failedChildIndex = children.findIndex(child => child.data.failed);
					children.splice(failedChildIndex, 1);
					nextState = (failedChildIndex >= 0 && children.findIndex(child => child.data.failed) === -1) ? order++ : 0;
					break;
				}
				case (NodeType.PAND_NODE) : {
					const children = getChildren(node);
					const failedList = children.map(child => {return child.data.failed})
					nextState = failedList.every(function (x, i) { return x > 0 && (i === 0 || x >= failedList[i - 1]); }) ? order++ : 0;
					break;
				}
				case (NodeType.SPARE_NODE) : {
					const incomingEdges = getIncomingEdges(node);
					const primaryNodeName = incomingEdges.find(edge => edge.targetHandle?.includes("primary"))?.source
					const primaryNode = nodes.find(nd => primaryNodeName === nd.id) as Node;
					const spareNodeNames = incomingEdges.filter(edge => edge.targetHandle?.includes("spare")).map(edge => edge.source);
					const spareNodes = spareNodeNames.map(name => nodes.find(node => node.id === name) as Node);
					const currentSpare = spareNodes.find(spare => spare.data.beingUsedBy === node.id && spare.data.failed === 0);
					if (primaryNode.data.failed) {
						if (!currentSpare) {
							const inactiveSpare = spareNodes.find(node => node.data.failed === null);
							if (inactiveSpare) {
								inactiveSpare.data.beingUsedBy = node.id;
								inactiveSpare.data.failed = 0;
								setNodes(nodes.map(nd => nd.id === inactiveSpare.id ? inactiveSpare : nd));
								return setTimeout(() => { doAnimate(); }, 1000) ;
							} else {
								nextState = order++;
								break;
							}
						} else {
							nextState = 0;
							break;
						}
					} else {
						if (currentSpare) {
							currentSpare.data.beingUsedBy === null;
							currentSpare.data.failed = null;
							setNodes(nodes.map(nd => nd.id === currentSpare.id ? currentSpare : nd));
							return setTimeout(() => { doAnimate(); }, 1000) ;
						}
						nextState = 0; 
						break;
					}
				}
				case (NodeType.FDEP_NODE) : {
					const incomingEdges = getIncomingEdges(node);
					const triggerNodeName = incomingEdges.find(edge => edge.targetHandle?.includes("trigger"))?.source
					const triggerNode = nodes.find(nd => triggerNodeName === nd.id) as Node;
					const dependentNodeNames = incomingEdges.filter(edge => edge.targetHandle?.includes("dependent")).map(edge => edge.source);
					const dependentNodes = dependentNodeNames.map(name => nodes.find(node => node.id === name) as Node);
					nextState = triggerNode.data.failed ? order++ : 0;
					if (triggerNode.data.failed) {
						if ((nextState > 0 && node.data.failed as number > 0) || nextState === node.data.failed) {
							return doAnimate();
						}
						setNodes(nodes.map(nd => {nd.data.failed = nd === node ? nextState : nd.data.failed; return nd;}))
						const dependentNodesToFail = dependentNodes.filter(node => !node.data.failed);
						if (dependentNodesToFail.length > 0) {
							toFail = dependentNodesToFail.map(node => node.id).concat(toFail);
							return setTimeout(() => { doAnimate(); }, 1000) ;
						}
						return;
					}
					break;
				}
				default : {
					return;
				}
			}
			if ((nextState > 0 && node.data.failed as number > 0) || nextState === node.data.failed) {
				return doAnimate();
			}
			setNodes(nodes.map(nd => {nd.data.failed = nd === node ? nextState : nd.data.failed; return nd;}))
			const {outgoingNodes} = getOutgoingNodesAndEdges(node);
			toFail = outgoingNodes.map(node => node.id).concat(toFail);
		}
        console.log("Running:" + running)
        setTimeout(() => {
            doAnimate()
        }, 1000)
    }, [running, nodes, edges, props.selected])

    useEffect(() => {
        running = props.currentlyAnimating

        //Disable/enable interaction with the FlowDisplay
        setDisabled(running)
        if (!running) {
            setNodes(nodes.map(node => {
                node.data.failed = props.selected.includes(node.id) ? 1 : null
                return node
            }))
            return
        }
        if (running) {
            doAnimate()
        }
    }, [props.currentlyAnimating])


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
        const sourceNode = nodes.find(node => node.id === connection.source) as Node
        const {handleType} = parseHandleId(connection.targetHandle)
        if (handleType && sourceNode.type === NodeType.EVENT_NODE) {
            sourceNode.data.isSpare = true
            setNodes(nodes.map(node => node.id === sourceNode.id ? sourceNode : node))
        } else if (handleType !== "dependent" && sourceNode.type === NodeType.EVENT_NODE) {
            sourceNode.data.isSpare = false
            setNodes(nodes.map(node => node.id === sourceNode.id ? sourceNode : node))
        }
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
                        failed: nd.data.failed === null ? 1 : null,
                    }
                }
                return nd
            })
        })

    }

    return (
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeElementsMap}
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
    )
}
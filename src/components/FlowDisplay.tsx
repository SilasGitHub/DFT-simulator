import React, {useEffect} from "react"
import ReactFlow, {
    Background,
    BackgroundVariant,
    Connection,
    Controls,
    Edge,
    MiniMap,
    Node,
    ReactFlowInstance,
} from "reactflow"
import "reactflow/dist/style.css"
import {EventNodeType, nodeElementsMap, NodeType, NodeUnion} from "./nodes/Nodes.ts"
import {createNodeId, parseHandleId} from "../utils/idParser.ts"
import Toolbar from "./Toolbar.tsx"
import {useDiagramStateStore} from "../stores/useDiagramStateStore.ts"
import Topbar from "./Topbar.tsx"
import {AnimationState, useDiagramAnimationStore} from "../stores/useDiagramAnimationStore.ts"

// do alphabe tletter based on number of event nodes
const ALPHABET = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
const TIMEOUT = 1000

let order = 1
let localAnimationState: AnimationState = "stopped"
let localAnimationSpeed = 1
let toFailIds = new Array<string>()
let activeTimeout: any = null

export default function FlowDisplay() {
    const [reactFlowInstance, setReactFlowInstance] = React.useState(null as null | ReactFlowInstance)
    const {
        nodes,
        setNodes,
        onNodesChange,
        edges,
        addNode,
        onEdgesChange,
        getIncomingEdges,
        getOutgoingNodesAndEdges,
        getChildren,
        getNodeById,
        onConnect,
        animationSpeed,
    } = useDiagramStateStore()
    const {
        addSelectedToFailIds,
        animationState,
        removeSelectedToFailIds,
        getNodeFailState,
        selectedToFailIds,
        isUiLocked,
        setNodeFailState,
        setNodeBeingUsedBy,
        getNodeBeingUsedBy,
    } = useDiagramAnimationStore()

    const onDragOver = React.useCallback((event: React.DragEvent) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = "move"
    }, [])

    const resetAnimation = React.useCallback(() => {
        setNodes((nds) => nds.map(node => {
            if (node.type === NodeType.EVENT_NODE && node.data.isSpare) {
                setNodeFailState(node.id, null)
                setNodeBeingUsedBy(node.id, null)
            } else {
                setNodeFailState(node.id, 0)
            }
            node.selected = false
            return node
        }))
    }, [setNodes])

    const doAnimate = React.useCallback(() => {
        if (activeTimeout) {
            return
        }
        if (localAnimationState !== "playing") {
            if (localAnimationState === "stopped") {
                toFailIds = []
            }
            return
        }

        if (toFailIds.length === 0) {
            toFailIds = [...selectedToFailIds]
            resetAnimation()
        } else {
            const nodeName = toFailIds.shift()
            const node = getNodeById(nodeName)!
            let nextState: number
            switch (node.type) {
                case (NodeType.SYSTEM_NODE) : {
                    const children = getChildren(node)
                    nextState = children.some(child => getNodeFailState(child.id)) ? order++ : 0
                    break
                }
                case (NodeType.EVENT_NODE) : {
                    nextState = order++
                    break
                }
                case (NodeType.AND_NODE) : {
                    const children = getChildren(node)
                    nextState = children.every(child => getNodeFailState(child.id)) ? order++ : 0
                    break
                }
                case (NodeType.OR_NODE) : {
                    const children = getChildren(node)
                    nextState = children.some(child => getNodeFailState(child.id)) ? order++ : 0
                    break
                }
                case (NodeType.XOR_NODE) : {
                    const children = getChildren(node)
                    const failedChildIndex = children.findIndex(child => getNodeFailState(child.id))
                    children.splice(failedChildIndex, 1)
                    nextState = (failedChildIndex >= 0 && children.findIndex(child => getNodeFailState(child.id)) === -1) ? order++ : 0
                    break
                }
                case (NodeType.PAND_NODE) : {
                    const children = getChildren(node)
                    const failedList = children.map(child => getNodeFailState(child.id))
                    nextState = failedList.every(function (x, i) {
                        return x !== null && x > 0 && (i === 0 || x >= (failedList[i - 1] ?? 0))
                    })
                        ? order++
                        : 0
                    break
                }
                case (NodeType.SPARE_NODE) : {
                    const incomingEdges = getIncomingEdges(node)
                    const primaryNodeName = incomingEdges.find(edge => edge.targetHandle?.includes("primary"))?.source
                    const primaryNode = nodes.find(nd => primaryNodeName === nd.id) as EventNodeType
                    const spareNodeNames = incomingEdges.filter(edge => edge.targetHandle?.includes("spare")).map(edge => edge.source)
                    const spareNodes = spareNodeNames.map(name => nodes.find(node => node.id === name) as EventNodeType)
                    const currentSpare = spareNodes.find(spare => getNodeBeingUsedBy(spare.id) === node.id && getNodeFailState(spare.id) === 0)
                    if (getNodeFailState(primaryNode.id)) {
                        if (!currentSpare) {
                            const inactiveSpare = spareNodes.find(node => getNodeFailState(node.id) === null)
                            if (inactiveSpare) {
                                setNodeBeingUsedBy(inactiveSpare.id, node.id)
                                setNodeFailState(inactiveSpare.id, 0)
                                setNodes((nds) => nds.map(nd => nd.id === inactiveSpare.id ? inactiveSpare : nd) as NodeUnion[])
                                activeTimeout = setTimeout(() => {
                                    activeTimeout = null
                                    doAnimate()
                                }, TIMEOUT / localAnimationSpeed)
                                return
                            } else {
                                nextState = order++
                                break
                            }
                        } else {
                            nextState = 0
                            break
                        }
                    } else {
                        if (currentSpare) {
                            setNodeBeingUsedBy(currentSpare.id, null)
                            setNodeFailState(currentSpare.id, null)
                            setNodes((nds) => nds.map(nd => nd.id === currentSpare.id ? currentSpare : nd) as NodeUnion[])
                            activeTimeout = setTimeout(() => {
                                activeTimeout = null
                                doAnimate()
                            }, TIMEOUT / localAnimationSpeed)
                            return
                        }
                        nextState = 0
                        break
                    }
                }
                case (NodeType.FDEP_NODE) : {
                    const incomingEdges = getIncomingEdges(node)
                    const triggerNodeName = incomingEdges.find(edge => edge.targetHandle?.includes("trigger"))?.source
                    const triggerNode = nodes.find(nd => triggerNodeName === nd.id) as NodeUnion
                    const dependentNodeNames = incomingEdges.filter(edge => edge.targetHandle?.includes("dependent")).map(edge => edge.source)
                    const dependentNodes = dependentNodeNames.map(name => nodes.find(node => node.id === name) as EventNodeType)
                    nextState = getNodeFailState(triggerNode.id) ? order++ : 0
                    if (getNodeFailState(triggerNode.id)) {
                        if ((nextState > 0 && getNodeFailState(node.id) as number > 0) || nextState === getNodeFailState(node.id)) {
                            return doAnimate()
                        }
                        for (const nd of nodes) {
                            setNodeFailState(nd.id, nd === node ? nextState : getNodeFailState(nd.id))
                        }
                        const dependentNodesToFail = dependentNodes.filter(node => !getNodeFailState(node.id))
                        if (dependentNodesToFail.length > 0) {
                            toFailIds = dependentNodesToFail.map(node => node.id).concat(toFailIds)
                            activeTimeout = setTimeout(() => {
                                activeTimeout = null
                                doAnimate()
                            }, TIMEOUT / localAnimationSpeed)
                            return
                        }
                        return
                    }
                    break
                }
                default : {
                    return
                }
            }
            if ((nextState > 0 && getNodeFailState(node.id) as number > 0) || nextState === getNodeFailState(node.id)) {
                return doAnimate()
            }
            for (const nd of nodes) {
                setNodeFailState(nd.id, nd === node ? nextState : getNodeFailState(nd.id))
            }
            const {outgoingNodes} = getOutgoingNodesAndEdges(node)
            toFailIds = outgoingNodes.map(node => node.id).concat(toFailIds)
        }

        activeTimeout = setTimeout(() => {
            activeTimeout = null
            doAnimate()
        }, TIMEOUT / localAnimationSpeed)
    }, [selectedToFailIds, resetAnimation, getNodeById, setNodes, nodes, getOutgoingNodesAndEdges, getChildren, getIncomingEdges])

    useEffect(() => {
            const lastAnimationState = localAnimationState
            localAnimationState = animationState

            if (lastAnimationState !== "stopped" && localAnimationState === "stopped") {
                for (const node of nodes) {
                    setNodeFailState(node.id, selectedToFailIds.includes(node.id) ? 1 : null)
                }
                return
            } else if (localAnimationState === "playing") {
                doAnimate()
            }
        },
        [animationState, doAnimate, nodes, selectedToFailIds, setNodes],
    )

    useEffect(() => {
        localAnimationSpeed = animationSpeed
    }, [animationSpeed])

    const onDrop = React.useCallback((event: React.DragEvent) => {
            event.preventDefault()
            if (reactFlowInstance === null) {
                return
            }

            const type = event.dataTransfer.getData("application/reactflow") as NodeType
            if (typeof type === "undefined" || !type) {
                return
            }

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            })
            const nEventNodes = nodes.reduce((acc, node) => {
                if (node.type === NodeType.EVENT_NODE) {
                    return acc + 1
                }
                return acc
            }, 0)

            addNode({
                id: createNodeId(type),
                type,
                position,
                data: {label: ALPHABET[nEventNodes % ALPHABET.length]},
                selected: true,
            } as NodeUnion)
        },
        [addNode, nodes, reactFlowInstance],
    )

    const onConnectWrap = (connection: Connection) => {
        const sourceNode = nodes.find(node => node.id === connection.source) as Node
        const {handleType} = parseHandleId(connection.targetHandle)
        if (handleType === "spare" && sourceNode.type === NodeType.EVENT_NODE) {
            sourceNode.data.isSpare = true
            setNodes((nds) => nds.map(node => node.id === sourceNode.id ? sourceNode : node) as NodeUnion[])
        } else if (handleType !== "dependent" && sourceNode.type === NodeType.EVENT_NODE) {
            sourceNode.data.isSpare = false
            setNodes((nds) => nds.map(node => node.id === sourceNode.id ? sourceNode : node) as NodeUnion[])
        }
        onConnect(connection)
    }

    const onNodeClick = (_: React.MouseEvent, node: Node) => {
        if (animationState !== "stopped" || node.type !== NodeType.EVENT_NODE) {
            return
        }

        // If we double click on a basic event node, select or unselect it from the list of events to fail
        if (selectedToFailIds.includes(node.id)) {
            removeSelectedToFailIds([node.id])
        } else {
            addSelectedToFailIds([node.id])
        }

        // Highlight the selected basic event by changing it's internal state to 'failed' which will update it's background color
        setNodeFailState(node.id, getNodeFailState(node.id) === null ? 1 : null)
    }

    const onEdgesDelete = (deleted: Edge[]) => {
        removeSelectedToFailIds(selectedToFailIds.filter(id => !deleted.map(edge => edge.id).includes(id)))
    }

    const onNodesDelete = (deleted: Node[]) => {
        // let connectedEdges = new Array<Edge>();
        // deleted.forEach(node => connectedEdges = connectedEdges.concat(edges.filter(edge => edge.source === node.id || edge.target === node.id)));
        // const deletedIds = connectedEdges.map(edge => edge.id).concat(deleted.map(node => node.id));
        removeSelectedToFailIds(selectedToFailIds.filter(id => !deleted.map(node => node.id).includes(id)))
    }

    return (
        <div className="h-full flex-grow">
            <Topbar reactFlowInstance={reactFlowInstance}/>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeElementsMap}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                onNodesChange={onNodesChange}
                onNodesDelete={onNodesDelete}
                onEdgesChange={onEdgesChange}
                onEdgesDelete={onEdgesDelete}
                onConnect={onConnectWrap}
                onNodeClick={onNodeClick}
                edgesUpdatable={!isUiLocked}
                edgesFocusable={!isUiLocked}
                nodesDraggable={!isUiLocked}
                nodesConnectable={!isUiLocked}
                nodesFocusable={!isUiLocked}
                elementsSelectable={!isUiLocked}
            >
                <Background variant={BackgroundVariant.Dots} gap={12} size={1.2}/>
                <Controls
                    position="top-left"
                    showInteractive={true}
                    className="rounded-lg shadow-md overflow-hidden border-4 border-theme-border bg-background-floating"
                />
                <MiniMap
                    position="top-right"
                    className="rounded-2xl shadow-md overflow-hidden border-4 border-theme-border bg-background-floating"
                />
                <Toolbar/>
            </ReactFlow>
        </div>
    )
}
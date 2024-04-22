import React, {HTMLAttributes, useMemo} from "react"
import {
    Connection,
    getConnectedEdges,
    Handle,
    HandleProps,
    ReactFlowState,
    useNodeId,
    useStore,
} from "reactflow"
import {parseHandleId} from "../utils/idParser.ts"
import {handleRestrictionsMap, NodeType} from "./nodes/Nodes.ts"
import {useDiagramStateStore} from "../stores/useDiagramStateStore.ts"

// Taken from: https://reactflow.dev/examples/nodes/connection-limit

const selector = (state: ReactFlowState) => (state)

type CustomHandleProps = {
    isConnectable: boolean | number
} & Omit<HandleProps & Omit<HTMLAttributes<HTMLDivElement>, "id">, "isConnectable">

export default function CustomHandle({isConnectable, ...rest}: CustomHandleProps) {
    const {edges} = useStore(selector)
    const {getNodeById, getOutgoingNodesAndEdges} = useDiagramStateStore()
    const nodeId = useNodeId()

    const isHandleConnectable = useMemo(() => {
        if (!nodeId) return false

        if (typeof isConnectable === "number") {
            const node = getNodeById(nodeId)
            if (!node) return false
            const connectedEdges = getConnectedEdges([node], edges).filter((value) => {
                return value.targetHandle === rest.id && value.target === nodeId
            })
            return connectedEdges.length < isConnectable
        }

        return isConnectable
    }, [isConnectable, rest.id, nodeId, edges])

    /**
     * This valid connection runs on the source handle
     *
     * This validation in run on the side that started the connection, so if we drag from
     * EventNode to FdepNode, EventNode will check validity: we need a global store for which nodes can connect to which
     * Yet, source and target handle values here are always consistent: as defined by the handle type
     */
    const isValidConnection = React.useCallback((connection: Connection) => {
        // allow connecting self only once
        const sourceNode = getNodeById(connection.source)!
        const targetNode = getNodeById(connection.target)!
        // const targetHandle = connection.targetHandle

        const {outgoingNodes} = getOutgoingNodesAndEdges(sourceNode)
        if (outgoingNodes.includes(targetNode)) {
            // this node is already connected to the target node, so we don't allow the connection
            return false
        }

        // allow connecting only to compatible types
        const {nodeType, handleType} = parseHandleId(connection.targetHandle)
        const nodeTypeRestrictions = handleRestrictionsMap[nodeType]
        if (!nodeTypeRestrictions) {
            return true
        }
        const restrictedTypes = nodeTypeRestrictions[handleType]
        // we cannot retrieve the target handle, so must get the allowed node types from somewhere else:
        if (!restrictedTypes) {
            return true
        }
        return restrictedTypes.includes(sourceNode.type as NodeType)
    }, [getNodeById, getOutgoingNodesAndEdges])

    return (
        <Handle
            {...rest as HandleProps}
            isConnectable={isHandleConnectable}
            isValidConnection={isValidConnection}
            style={{...rest.style, minWidth: "10px", minHeight: "10px"}}
        />
    )
}


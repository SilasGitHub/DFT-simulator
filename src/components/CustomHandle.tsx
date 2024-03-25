import React, {HTMLAttributes, useMemo} from "react"
import {
    Connection,
    getConnectedEdges,
    Handle,
    HandleProps,
    ReactFlowState,
    useNodeId,
    useNodes,
    useStore,
} from "reactflow"
import {useNodeUtils} from "../utils/useNodeUtils.tsx"

// Taken from: https://reactflow.dev/examples/nodes/connection-limit

const selector = (state: ReactFlowState) => (state)

type CustomHandleProps = {
    isConnectable: boolean | number,
    /**
     * Which types of nodes should be able to connect to this handle
     */
    // allowedNodeConnectionTypes?: NodeType[],
} & Omit<HandleProps & Omit<HTMLAttributes<HTMLDivElement>, "id">, "isConnectable">

export default function CustomHandle({isConnectable, ...rest}: CustomHandleProps) {
    const {nodeInternals, edges, ...state} = useStore(selector)
    const {getNodeById, getOutgoingNodesAndEdges} = useNodeUtils(useNodes(), edges)
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
    }, [isConnectable, rest.id, nodeInternals, nodeId, edges])

    /**
     * This valid connection runs on the source handle
     */
    const isValidConnection = React.useCallback((connection: Connection) => {
        if (rest.id === 'dependent-1') {
            console.log(rest)
        }
        // allow connecting self only once
        const sourceNode = getNodeById(connection.source)!
        const targetNode = getNodeById(connection.target)!
        // const targetHandle = connection.targetHandle

        const {outgoingNodes} = getOutgoingNodesAndEdges(sourceNode)
        if (outgoingNodes.includes(targetNode)) {
            // this node is already connected to the target node, so we don't allow the connection
            return false
        }

        // // allow connecting only to compatible types
        // if (!allowedNodeConnectionTypes) {
        //     return true
        // }
        // return allowedNodeConnectionTypes.includes(targetNode.type as NodeType)
        return true
    }, [getNodeById, getOutgoingNodesAndEdges, state])

    return (
        <Handle
            {...rest as HandleProps}
            isConnectable={isHandleConnectable}
            isValidConnection={isValidConnection}
            style={{...rest.style, minWidth: "10px", minHeight: "10px"}}
        />
    )
}


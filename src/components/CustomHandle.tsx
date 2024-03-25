import {HTMLAttributes, useMemo} from "react"
import {getConnectedEdges, Handle, HandleProps, ReactFlowState, useNodeId, useStore} from "reactflow"
import {NodeUnion} from "./nodes/Nodes.ts"

// Taken from: https://reactflow.dev/examples/nodes/connection-limit

const selector = (state: ReactFlowState) => ({
    nodeInternals: state.nodeInternals,
    edges: state.edges,
})

type CustomHandleProps = {
    isConnectable: boolean | number
} & Omit<HandleProps & Omit<HTMLAttributes<HTMLDivElement>, 'id'>, "isConnectable">

export default function CustomHandle(props: CustomHandleProps) {
    const {nodeInternals, edges} = useStore(selector)
    const nodeId = useNodeId()

    const isHandleConnectable = useMemo(() => {
        if (!nodeId) return false

        if (typeof props.isConnectable === "number") {
            const node = nodeInternals.get(nodeId) as NodeUnion
            const connectedEdges = getConnectedEdges([node], edges).filter((value) => {
                return value.targetHandle === props.id && value.target === nodeId
            })
            return connectedEdges.length < props.isConnectable
        }

        return props.isConnectable
    }, [props.isConnectable, props.id, nodeInternals, nodeId, edges])

    return (
        <Handle {...props as HandleProps} isConnectable={isHandleConnectable} style={{minWidth: '10px', minHeight: '10px'}} ></Handle>
    )
}


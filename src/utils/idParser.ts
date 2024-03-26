import {NodeType} from "../components/nodes/Nodes.ts"

export const createNodeId = (nodeType: NodeType, name: string, number?: number) => {
    return `${nodeType}:${name}:${number}`
}

export const parseNodeId = (nodeId: string | null) => {
    const parts = nodeId?.split(":")

    if (parts?.length !== 3) {
        throw Error("Node ID invalid: " + nodeId)
    }

    return {
        nodeType: NodeType[parts[0] as keyof typeof NodeType],
        name: parts[1],
        number: parts[2] ? Number(parts[2]) : undefined
    }
}

export const createHandleId = (nodeType: NodeType, handleType: string, number?: number) => {
    return `${nodeType}:${handleType}:${number}`
}

export const parseHandleId = (handleId: string | null | undefined) => {
    const parts = handleId?.split(":")

    if (parts?.length !== 3) {
        throw Error("Handle ID invalid: " + handleId)
    }

    return {
        nodeType: NodeType[parts[0] as keyof typeof NodeType],
        handleType: parts[1],
        number: parts[2] ? Number(parts[2]) : undefined,
    }
}
import {NodeType} from "../components/nodes/Nodes.ts"
import {v4 as uuidv4} from "uuid"

export const createNodeId = (nodeType: NodeType, uuid?: string) => {
    return `${nodeType}:${uuid ?? uuidv4()}`
}

export const parseNodeId = (nodeId: string | null) => {
    const parts = nodeId?.split(":")

    if (parts?.length !== 2) {
        throw Error("Node ID invalid: " + nodeId)
    }

    return {
        nodeType: NodeType[parts[0] as keyof typeof NodeType],
        number: parts[1]
    }
}

export const createHandleId = (nodeType: NodeType, handleType: string, number?: number) => {
    return `${nodeType}:${handleType}:${number ?? ""}`
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
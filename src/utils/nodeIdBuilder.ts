import {NodeType} from "../components/nodes/Nodes.ts"

export const createNodeId = (nodeType: NodeType, name: string, number: number) => {
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
        number: Number(parts[2]),
    }
}
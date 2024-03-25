import {Edge, getIncomers, getOutgoers, Node} from "reactflow"
import {NodeUnion} from "../components/nodes/Nodes.ts"
import React from "react"

export const useNodeUtils = (nodes: Node[], edges: Edge[]) => {
    const getNodeById = React.useCallback(<T extends NodeUnion>(id: string | null | undefined): T | null => {
        if (!id) {
            return null
        }
        return nodes.find(node => node.id === id) as T
    }, [nodes])

    const getOutgoingNodesAndEdges = React.useCallback((node: Node) => {
        const outgoingNodes = getOutgoers(node, nodes, edges)
        const outgoingEdges = edges.filter(edge =>
            (edge.sourceNode === node || edge.targetNode === node)
            && (outgoingNodes.includes(edge.targetNode as Node) || outgoingNodes.includes(edge.sourceNode as Node)),
        )
        return {
            outgoingEdges,
            outgoingNodes: outgoingNodes as Node[],
        }
    }, [nodes, edges])

    const getIncomingEdges = React.useCallback((node: Node): Edge[] => {
        return edges.filter(edge => edge.target === node.id)
    }, [edges])

    const getChildren = React.useCallback((node: Node): Node[] => {
        return getIncomers(node, nodes, edges)
    }, [nodes, edges])

    return {
        getNodeById,
        getOutgoingNodesAndEdges,
        getIncomingEdges,
        getChildren,
    }
}
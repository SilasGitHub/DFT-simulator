import {Edge, getIncomers, getOutgoers, Node} from "reactflow"
import React from "react"
import { parseHandleId } from "./idParser"

export const useNodeUtils = (nodes: Node[], edges: Edge[]) => {
    const getNodeById = React.useCallback(<T extends Node>(id: string | null | undefined): T | null => {
        if (!id) {
            return null
        }
        return nodes.find(node => node.id === id) as T
    }, [nodes])

    const getOutgoingNodesAndEdges = React.useCallback((node: Node) => {
        const outgoingNodes = getOutgoers(node, nodes, edges)
        const outgoingEdges = edges.filter(edge =>
            (edge.source === node.id || edge.target === node.id)
            && (outgoingNodes.map(n => n.id).includes(edge.target) || outgoingNodes.map(n => n.id).includes(edge.source)),
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
        const incomers = getIncomers(node, nodes, edges)
		incomers.sort((a, b) => {
			const edgeA = edges.find(edge => edge.target === node.id && edge.source === a.id) as Edge;
			const edgeB = edges.find(edge => edge.target === node.id && edge.source === b.id) as Edge; 
			return (parseHandleId(edgeA.targetHandle).number as number) - (parseHandleId(edgeB.targetHandle).number as number);
		})
		return incomers;
    }, [nodes, edges])

    return {
        getNodeById,
        getOutgoingNodesAndEdges,
        getIncomingEdges,
        getChildren,
    }
}
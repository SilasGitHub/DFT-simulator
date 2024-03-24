/* eslint-disable no-case-declarations */
// Start with the system node - recursively work up until you reach an event node.
// Take into consideration the semantics of the currently expored node (e.g.: if exporing an AND node, only return true if both paths returned true)
import {Edge, getIncomers} from "reactflow"
import {NodeType, NodeUnion} from "../components/nodes/Nodes"


export default function get_edges_to_animate(current_node: NodeUnion, all_nodes: NodeUnion[], all_edges: Edge[]): [boolean, Edge[]] {
    const allIncoming = getIncomers(current_node, all_nodes, all_edges) as NodeUnion[]
    const allConnectedEdges = all_edges.filter((ed) => {
        return ed.target === current_node.id
    })

    switch (current_node.type) {
        case NodeType.SYSTEM_NODE: {
            if (allIncoming.length <= 0) {
                return [false, []]
            }

            const [active, edges] = get_edges_to_animate(allIncoming[0], all_nodes, all_edges)
            if (active) {
                return [active, [...edges, ...allConnectedEdges]]
            } else {
                return [active, edges]
            }
        }
        case NodeType.EVENT_NODE:
            return [current_node.data.failed ?? false, []]
        case NodeType.OR_NODE: {
            const lhsEdge = allConnectedEdges.find((edge) => {
                return edge.targetHandle === "a" && edge.target === current_node.id
            })
            const rhsEdge = allConnectedEdges.find((edge) => {
                return edge.targetHandle === "b" && edge.target === current_node.id
            })

            const lhsNode = !lhsEdge ? null : allIncoming.find((node) => {
                return node.id === lhsEdge.source
            })
            const rhsNode = !rhsEdge ? null : allIncoming.find((node) => {
                return node.id === rhsEdge.source
            })

            const [lhsActive, lhsEdges] = !lhsNode ? [false, []] : get_edges_to_animate(lhsNode, all_nodes, all_edges)
            const [rhsActive, rhsEdges] = !rhsNode ? [false, []] : get_edges_to_animate(rhsNode, all_nodes, all_edges)

            const resEdges = [...lhsEdges, ...rhsEdges]

            if (lhsActive && lhsEdge) {
                resEdges.push(lhsEdge)
            }

            if (rhsActive && rhsEdge) {
                resEdges.push(rhsEdge)
            }

            return [rhsActive || lhsActive, resEdges]
        }
        case NodeType.SPARE_NODE:
        case NodeType.AND_NODE: {
            const lhsEdgeAnd = allConnectedEdges.find((edge) => {
                return edge.targetHandle === "a" && edge.target === current_node.id
            })
            const rhsEdgeAnd = allConnectedEdges.find((edge) => {
                return edge.targetHandle === "b" && edge.target === current_node.id
            })

            const lhsNodeAnd = !lhsEdgeAnd ? null : allIncoming.find((node) => {
                return node.id === lhsEdgeAnd.source
            })
            const rhsNodeAnd = !rhsEdgeAnd ? null : allIncoming.find((node) => {
                return node.id === rhsEdgeAnd.source
            })

            const [lhsActiveAnd, lhsEdgesAnd] = !lhsNodeAnd ? [false, []] : get_edges_to_animate(lhsNodeAnd, all_nodes, all_edges)
            const [rhsActiveAnd, rhsEdgesAnd] = !rhsNodeAnd ? [false, []] : get_edges_to_animate(rhsNodeAnd, all_nodes, all_edges)

            const resEdgesAnd = [...lhsEdgesAnd, ...rhsEdgesAnd]

            if (lhsActiveAnd && rhsActiveAnd) {
                if (lhsEdgeAnd) {
                    resEdgesAnd.push(lhsEdgeAnd)
                }
                if (rhsEdgeAnd) {
                    resEdgesAnd.push(rhsEdgeAnd)
                }
            }

            return [lhsActiveAnd && rhsActiveAnd, resEdgesAnd]
        }
        case NodeType.XOR_NODE: {
            const lhsEdgeXor = allConnectedEdges.find((edge) => {
                return edge.targetHandle === "a" && edge.target === current_node.id
            })
            const rhsEdgeXor = allConnectedEdges.find((edge) => {
                return edge.targetHandle === "b" && edge.target === current_node.id
            })

            const lhsNodeXor = !lhsEdgeXor ? null : allIncoming.find((node) => {
                return node.id === lhsEdgeXor.source
            })
            const rhsNodeXor = !rhsEdgeXor ? null : allIncoming.find((node) => {
                return node.id === rhsEdgeXor.source
            })

            const [lhsActiveXor, lhsEdgesXor] = !lhsNodeXor ? [false, []] : get_edges_to_animate(lhsNodeXor, all_nodes, all_edges)
            const [rhsActiveXor, rhsEdgesXor] = !rhsNodeXor ? [false, []] : get_edges_to_animate(rhsNodeXor, all_nodes, all_edges)

            const resEdgesXor = [...lhsEdgesXor, ...rhsEdgesXor]

            if (lhsActiveXor !== rhsActiveXor) {
                if (lhsEdgeXor) {
                    resEdgesXor.push(lhsEdgeXor)
                }
                if (rhsEdgeXor) {
                    resEdgesXor.push(rhsEdgeXor)
                }
            }

            return [lhsActiveXor !== rhsActiveXor, resEdgesXor]
        }
        case NodeType.PAND_NODE: {
            const lhsEdgePand = allConnectedEdges.find((edge) => {
                return edge.targetHandle === "a" && edge.target === current_node.id
            })
            const rhsEdgePand = allConnectedEdges.find((edge) => {
                return edge.targetHandle === "b" && edge.target === current_node.id
            })

            const lhsNodePand = !lhsEdgePand ? null : allIncoming.find((node) => {
                return node.id === lhsEdgePand.source
            })
            const rhsNodePand = !rhsEdgePand ? null : allIncoming.find((node) => {
                return node.id === rhsEdgePand.source
            })

            const [lhsActivePand, lhsEdgesPand] = !lhsNodePand ? [false, []] : get_edges_to_animate(lhsNodePand, all_nodes, all_edges)
            const [rhsActivePand, rhsEdgesPand] = !rhsNodePand ? [false, []] : get_edges_to_animate(rhsNodePand, all_nodes, all_edges)

            const resEdgesPand = [...lhsEdgesPand, ...rhsEdgesPand]
            if (lhsActivePand && rhsActivePand && lhsNodePand?.data.simulation?.failed < rhsNodePand?.data.simulation?.failed) {
                if (lhsEdgePand) {
                    resEdgesPand.push(lhsEdgePand)
                }
                if (rhsEdgePand) {
                    resEdgesPand.push(rhsEdgePand)
                }
            }

            return [lhsActivePand && rhsActivePand && lhsNodePand?.data.simulation?.failed < rhsNodePand?.data.simulation?.failed, resEdgesPand]
        }
        case NodeType.FDEP_NODE:
            break
    }

    throw new Error("Exploring node of unknown type " + current_node.type)
}
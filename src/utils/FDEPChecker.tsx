/* eslint-disable no-case-declarations */
// Start with the system node - recursively work up until you reach an event node. 
// Take into consideration the semantics of the currently expored node (e.g.: if exporing an AND node, only return true if both paths returned true)
import {getIncomers, Node, Edge} from 'reactflow';


export default function get_edges_to_animate(current_node: Node, all_nodes: Node[], all_edges: Edge[]): [boolean, Edge[]] {
    const allIncoming = getIncomers(current_node, all_nodes, all_edges);
    const allConnectedEdges = all_edges.filter((ed) => {return ed.target == current_node.id})

    switch (current_node.type) {
        case "sysNode":
            if ( allIncoming.length <= 0) {
                return [false, []];
            }

            const [active, edges] = get_edges_to_animate(allIncoming[0], all_nodes, all_edges)
            if (active) {
                return [active, [...edges, ...allConnectedEdges]]
            } else {
                return [active, edges]
            }
        case "eventNode":
            return [current_node.data.failed, []]
        case "orNode":
            const lhsEdge = allConnectedEdges.find((edge) => {return edge.targetHandle == 'a' && edge.target == current_node.id});
            const rhsEdge = allConnectedEdges.find((edge) => {return edge.targetHandle == 'b' && edge.target == current_node.id});

            const lhsNode = lhsEdge == null ? null : allIncoming.find((node) => {return node.id === lhsEdge.source})
            const rhsNode = rhsEdge == null ? null : allIncoming.find((node) => {return node.id === rhsEdge.source})
            
            const [lhsActive, lhsEdges] = lhsNode == null ? [false, []] : get_edges_to_animate(lhsNode, all_nodes, all_edges)
            const [rhsActive, rhsEdges] = rhsNode == null ? [false, []] : get_edges_to_animate(rhsNode, all_nodes, all_edges)
            
            let resEdges = [...lhsEdges, ...rhsEdges]

            if (lhsActive) {
                resEdges = [...resEdges, lhsEdge]
            }

            if (rhsActive) {
                resEdges = [...resEdges, rhsEdge]
            }

            return [rhsActive || lhsActive, resEdges]
        case "spareNode":
        case "andNode":
            const lhsEdgeAnd = allConnectedEdges.find((edge) => {return edge.targetHandle == 'a' && edge.target == current_node.id});
            const rhsEdgeAnd = allConnectedEdges.find((edge) => {return edge.targetHandle == 'b' && edge.target == current_node.id});
        
            const lhsNodeAnd = lhsEdgeAnd == null ? null : allIncoming.find((node) => {return node.id === lhsEdgeAnd.source})
            const rhsNodeAnd = rhsEdgeAnd == null ? null : allIncoming.find((node) => {return node.id === rhsEdgeAnd.source})
            
            const [lhsActiveAnd, lhsEdgesAnd] = lhsNodeAnd == null ? [false, []] : get_edges_to_animate(lhsNodeAnd, all_nodes, all_edges)
            const [rhsActiveAnd, rhsEdgesAnd] = rhsNodeAnd == null ? [false, []] : get_edges_to_animate(rhsNodeAnd, all_nodes, all_edges)
            
            let resEdgesAnd = [...lhsEdgesAnd, ...rhsEdgesAnd]
        
            if (lhsActiveAnd && rhsActiveAnd) {
                resEdgesAnd = [...resEdgesAnd, lhsEdgeAnd, rhsEdgeAnd]
            }
        
            return [lhsActiveAnd && rhsActiveAnd, resEdgesAnd]
        
        case "xorNode":
            const lhsEdgeXor = allConnectedEdges.find((edge) => {return edge.targetHandle == 'a' && edge.target == current_node.id});
            const rhsEdgeXor = allConnectedEdges.find((edge) => {return edge.targetHandle == 'b' && edge.target == current_node.id});
        
            const lhsNodeXor = lhsEdgeXor == null ? null : allIncoming.find((node) => {return node.id === lhsEdgeXor.source})
            const rhsNodeXor = rhsEdgeXor == null ? null : allIncoming.find((node) => {return node.id === rhsEdgeXor.source})
            
            const [lhsActiveXor, lhsEdgesXor] = lhsNodeXor == null ? [false, []] : get_edges_to_animate(lhsNodeXor, all_nodes, all_edges)
            const [rhsActiveXor, rhsEdgesXor] = rhsNodeXor == null ? [false, []] : get_edges_to_animate(rhsNodeXor, all_nodes, all_edges)
            
            let resEdgesXor = [...lhsEdgesXor, ...rhsEdgesXor]
        
            if (lhsActiveXor != rhsActiveXor) {
                resEdgesXor = [...resEdgesXor, lhsEdgeXor, rhsEdgeXor]
            }
        
            return [lhsActiveXor != rhsActiveXor, resEdgesXor]
        case "pandNode":
            const lhsEdgePand = allConnectedEdges.find((edge) => {return edge.targetHandle == 'a' && edge.target == current_node.id});
            const rhsEdgePand = allConnectedEdges.find((edge) => {return edge.targetHandle == 'b' && edge.target == current_node.id});
        
            const lhsNodePand = lhsEdgePand == null ? null : allIncoming.find((node) => {return node.id === lhsEdgePand.source})
            const rhsNodePand = rhsEdgePand == null ? null : allIncoming.find((node) => {return node.id === rhsEdgePand.source})
            
            const [lhsActivePand, lhsEdgesPand] = lhsNodePand == null ? [false, []] : get_edges_to_animate(lhsNodePand, all_nodes, all_edges)
            const [rhsActivePand, rhsEdgesPand] = rhsNodePand == null ? [false, []] : get_edges_to_animate(rhsNodePand, all_nodes, all_edges)
            
            let resEdgesPand = [...lhsEdgesPand, ...rhsEdgesPand]
        
            if (lhsActivePand && rhsActivePand && lhsNodePand.data.failed < rhsNodePand.data.failed) {
                resEdgesPand = [...resEdgesPand, lhsEdgePand, rhsEdgePand]
            }
        
            return [lhsActivePand && rhsActivePand && lhsNodePand.data.failed < rhsNodePand.data.failed, resEdgesPand]
        case "fdep":  
            break;
        default:
            throw new Error("Exploring node of unknown type");
            break;
    }
}
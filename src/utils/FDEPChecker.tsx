/* eslint-disable no-case-declarations */
// Start with the system node - recursively work up until you reach an event node. 
// Take into consideration the semantics of the currently expored node (e.g.: if exporing an AND node, only return true if both paths returned true)
import {getIncomers, Node, Edge} from 'reactflow';


export default function get_edges_to_animate(current_node: Node, all_nodes: Node[], all_edges: Edge[]): [boolean, Edge[]] {
    const allIncoming = getIncomers(current_node, all_nodes, all_edges);
    const allConnectedEdges = all_edges.filter((ed) => {return ed.target == current_node.id})
    const allOutGoingEdges = all_edges.filter((edges) => edges.source == current_node.id)

    switch (current_node.type) {
        case "sysNode":
            if ( allIncoming.length <= 0) {
                return [false, []];
            }

            return get_edges_to_animate(allIncoming[0], all_nodes, all_edges)
        case "sourceNode":
            if (current_node.data.failed != null) {
                return [true, allOutGoingEdges]
            } else {
                return [false, []]
            }
        case "orNode": {
            const lhsEdge = allConnectedEdges.find((edge) => {return edge.targetHandle == 'a' && edge.target == current_node.id});
            const rhsEdge = allConnectedEdges.find((edge) => {return edge.targetHandle == 'b' && edge.target == current_node.id});

            const lhsNode = lhsEdge == null ? null : allIncoming.find((node) => {return node.id === lhsEdge.source})
            const rhsNode = rhsEdge == null ? null : allIncoming.find((node) => {return node.id === rhsEdge.source})
            
            const [lhsActive, lhsEdges] = lhsNode == null ? [false, []] : get_edges_to_animate(lhsNode, all_nodes, all_edges)
            const [rhsActive, rhsEdges] = rhsNode == null ? [false, []] : get_edges_to_animate(rhsNode, all_nodes, all_edges)
            
            const resEdges = [...lhsEdges, ...rhsEdges]

            if (lhsActive || rhsActive) {
                return [true, [...resEdges, ...allOutGoingEdges]]
            } else {
                return [false, resEdges]
            }
        }
        case "spareNode":
        case "andNode": {
            const lhsEdge = allConnectedEdges.find((edge) => {return edge.targetHandle == 'a' && edge.target == current_node.id});
            const rhsEdge = allConnectedEdges.find((edge) => {return edge.targetHandle == 'b' && edge.target == current_node.id});
        
            const lhsNode = lhsEdge == null ? null : allIncoming.find((node) => {return node.id === lhsEdge.source})
            const rhsNode = rhsEdge == null ? null : allIncoming.find((node) => {return node.id === rhsEdge.source})
            
            const [lhsActive, lhsEdges] = lhsNode == null ? [false, []] : get_edges_to_animate(lhsNode, all_nodes, all_edges)
            const [rhsActive, rhsEdges] = rhsNode == null ? [false, []] : get_edges_to_animate(rhsNode, all_nodes, all_edges)
            
            const resEdges = [...lhsEdges, ...rhsEdges]

            if (lhsActive && rhsActive) {
                return [true, [...resEdges, ...allOutGoingEdges]]
            } else {
                return [false, resEdges]
            }
        }
        
        case "xorNode": {
            const lhsEdge = allConnectedEdges.find((edge) => {return edge.targetHandle == 'a' && edge.target == current_node.id});
            const rhsEdge = allConnectedEdges.find((edge) => {return edge.targetHandle == 'b' && edge.target == current_node.id});
        
            const lhsNode = lhsEdge == null ? null : allIncoming.find((node) => {return node.id === lhsEdge.source})
            const rhsNode = rhsEdge == null ? null : allIncoming.find((node) => {return node.id === rhsEdge.source})
            
            const [lhsActive, lhsEdges] = lhsNode == null ? [false, []] : get_edges_to_animate(lhsNode, all_nodes, all_edges)
            const [rhsActive, rhsEdges] = rhsNode == null ? [false, []] : get_edges_to_animate(rhsNode, all_nodes, all_edges)
            
            const resEdges = [...lhsEdges, ...rhsEdges]

            //XOR
            if (Boolean(lhsActive) !== Boolean(rhsActive)) {
                return [true, [...resEdges, ...allOutGoingEdges]]
            } else {
                return [false, resEdges]
            }
        }
        case "pandNode": {
            const lhsEdge = allConnectedEdges.find((edge) => {return edge.targetHandle == 'a' && edge.target == current_node.id});
            const rhsEdge = allConnectedEdges.find((edge) => {return edge.targetHandle == 'b' && edge.target == current_node.id});
        
            const lhsNode = lhsEdge == null ? null : allIncoming.find((node) => {return node.id === lhsEdge.source})
            const rhsNode = rhsEdge == null ? null : allIncoming.find((node) => {return node.id === rhsEdge.source})
            
            const [lhsActive, lhsEdges] = lhsNode == null ? [false, []] : get_edges_to_animate(lhsNode, all_nodes, all_edges)
            const [rhsActive, rhsEdges] = rhsNode == null ? [false, []] : get_edges_to_animate(rhsNode, all_nodes, all_edges)
            
            const resEdges = [...lhsEdges, ...rhsEdges]

            if (lhsActive && rhsActive && lhsNode.data.failed < rhsNode.data.failed) {
                return [true, [...resEdges, ...allOutGoingEdges]]
            } else {
                return [false, resEdges]
            }
        }
        case "fdep":  
            break;
        default:
            throw new Error("Exploring node of unknown type");
            break;
    }
}
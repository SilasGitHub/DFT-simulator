/* eslint-disable no-case-declarations */
// Start with the system node - recursively work up until you reach an event node. 
// Take into consideration the semantics of the currently expored node (e.g.: if exporing an AND node, only return true if both paths returned true)
import {getIncomers, Node, Edge} from 'reactflow';

export default function get_edges_to_animate(system_node: Node, all_nodes: Node[], all_edges: Edge[]): [boolean, Edge[]] {
    const allIncoming = getIncomers(system_node, all_nodes, all_edges);
    if (allIncoming.length <= 0) {
        return [false, []];
    }

    return explore_binary_nodes(allIncoming[0], all_nodes, all_edges)
}

function explore_binary_nodes(current_node: Node, all_nodes: Node[], all_edges: Edge[]): [boolean, Edge[]] {
    const allIncoming = getIncomers(current_node, all_nodes, all_edges);
    const allConnectedEdges = all_edges.filter((ed) => {return ed.target == current_node.id})
    const allOutGoingEdges = all_edges.filter((edges) => edges.source == current_node.id)

    const lhsEdge = allConnectedEdges.find((edge) => {return edge.targetHandle == 'a' && edge.target == current_node.id});
    const rhsEdge = allConnectedEdges.find((edge) => {return edge.targetHandle == 'b' && edge.target == current_node.id});

    const lhsNode = lhsEdge == null ? null : allIncoming.find((node) => {return node.id === lhsEdge.source})
    const rhsNode = rhsEdge == null ? null : allIncoming.find((node) => {return node.id === rhsEdge.source})
    
    const [lhsActive, lhsEdges] = lhsNode == null ? [false, []] : explore_binary_nodes(lhsNode, all_nodes, all_edges)
    const [rhsActive, rhsEdges] = rhsNode == null ? [false, []] : explore_binary_nodes(rhsNode, all_nodes, all_edges)
    
    const resEdges = [...lhsEdges, ...rhsEdges]

    switch (current_node.type) {            
        case "sourceNode":
            if (current_node.data.failed != null) {
                return [true, allOutGoingEdges]
            }
            break;
       case "orNode":
            if (lhsActive || rhsActive) {
                return [true, [...resEdges, ...allOutGoingEdges]]
            }
            break;
        case "spareNode":
        case "andNode":
            if (lhsActive && rhsActive) {
                return [true, [...resEdges, ...allOutGoingEdges]]
            }
            break;
        case "xorNode":
            //XOR
            if (Boolean(lhsActive) !== Boolean(rhsActive)) {
                return [true, [...resEdges, ...allOutGoingEdges]]
            }
            break;
        case "pandNode":
            if (lhsActive && rhsActive && lhsNode.data.failed < rhsNode.data.failed) {
                return [true, [...resEdges, ...allOutGoingEdges]]
            }
            break;
        case "fdep":
            return [false, []];
        default:
            throw new Error("Exploring node of unknown type");
    }
    return [false, resEdges]    
}
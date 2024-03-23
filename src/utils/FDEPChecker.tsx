// Start with the system node - recursively work up until you reach an event node. 
// Take into consideration the semantics of the currently expored node (e.g.: if exporing an AND node, only return true if both paths returned true)
import {getConnectedEdges, getIncomers} from 'reactflow';


export default function get_edges_to_animate(start_node, all_nodes, all_edges): any {
    const allIncoming = getIncomers(start_node, all_nodes, all_edges);
    const allConnectedEdges = all_edges.filter((ed, idx, arr) => {return ed.target == start_node.id})

    switch (start_node.type) {
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
        case "sourceNode":
            return [start_node.data.failed, []]
        case "orNode":
            const lhsEdge = allConnectedEdges.find((val, idx, arr) => {return val.targetHandle == 'a' && val.target == start_node.id});
            const rhsEdge = allConnectedEdges.find((val, idx, arr) => {return val.targetHandle == 'b' && val.target == start_node.id});

            const lhsNode = lhsEdge == null ? null : allIncoming.find((val, idx, arr) => {return val.id === lhsEdge.source})
            const rhsNode = rhsEdge == null ? null : allIncoming.find((val, idx, arr) => {return val.id === rhsEdge.source})
            
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
            
        default:
            break;
    }
}
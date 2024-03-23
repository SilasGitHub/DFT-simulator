/* eslint-disable no-case-declarations */
// Start with the system node - recursively work up until you reach an event node. 
// Take into consideration the semantics of the currently expored node (e.g.: if exporing an AND node, only return true if both paths returned true)
import {getConnectedEdges, getIncomers, Node, Edge} from 'reactflow';


export default function get_edges_to_animate(current_node: Node, all_nodes: Node[], all_edges: Edge[]): [boolean, Edge[]] {
    const allIncoming: Node[] = getIncomers(current_node, all_nodes, all_edges);
    const allConnectedEdges: Edge[] = getConnectedEdges([...allIncoming, current_node], all_edges);

    switch (current_node.type) {
        case "sysNode":
            if ( allIncoming.length <= 0) {
                return [false, []];
            }

            const [active, edges] = get_edges_to_animate(allIncoming[0], all_nodes, allConnectedEdges)
            if (active) {
                return [active, [...edges, ...getConnectedEdges([current_node], all_edges)]]
            } else {
                return [active, edges]
            }
        case "sourceNode":
            return [current_node.data.failed, []]
        case "orNode":
            const lhsEdge = allConnectedEdges.find((edge: Edge) => {return edge.target == current_node.id && edge.targetHandle == 'a'});
            const rhsEdge = allConnectedEdges.find((edge: Edge) => {return edge.target == current_node.id && edge.targetHandle == 'b'});
            // console.log(`lhsEdge: ${lhsEdge == null ? 'null' : lhsEdge}, rhsEdge: ${rhsEdge}`)
            const lhsNode = lhsEdge == null ? null : allIncoming.find((val) => {return val.id === lhsEdge.source})
            const rhsNode = rhsEdge == null ? null : allIncoming.find((val) => {return val.id === rhsEdge.source})
            
            const [lhsActive, lhsEdges] = lhsNode == null ? [false, []] : get_edges_to_animate(lhsNode, all_nodes, allConnectedEdges)
            const [rhsActive, rhsEdges] = rhsNode == null ? [false, []] : get_edges_to_animate(rhsNode, all_nodes, allConnectedEdges)
            // console.log(`node: ${current_node.type}`)
            // console.log(`lhsActive : ${lhsActive}`)
            // console.log(`lhsEdges : ${lhsEdges}`)
            // console.log(`rhsActive : ${rhsActive}`)
            // console.log(`rhsEdges : ${rhsEdges}`)

            let resEdges = [...lhsEdges, ...rhsEdges]
            console.log(resEdges)
            if (lhsActive) {
                resEdges = [...resEdges, lhsEdge]
            }

            if (rhsActive) {
                resEdges = [...resEdges, rhsEdge]
            }
            return [rhsActive || lhsActive, resEdges]
            
        default:
            throw new Error("Exploring node of unknown type");
            // return [false, []]
            break;
    }
}
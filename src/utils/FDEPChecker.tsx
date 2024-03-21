// Start with the system node - recursively work up until you reach an event node. 
// Take into consideration the semantics of the currently expored node (e.g.: if exporing an AND node, only return true if both paths returned true)

export default function expore_fdep(edges) {
    console.log("Exploring edges!")
    console.log(edges)
}
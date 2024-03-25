// dynamically create more handles
import React from "react"
import {useStore, useUpdateNodeInternals} from "reactflow"

export const useDynamicHandles = (id: string, idPrefix?: string) => {
    const [edgeCount, setEdgeCount] = React.useState(0)
    const updateNodeInternals = useUpdateNodeInternals()
    return useStore((s) => {
        const connectedEdges = s.edges.filter((e) => e.target === id && (idPrefix ? e.targetHandle?.startsWith(idPrefix) : true))
        if (connectedEdges.length !== edgeCount) {
            setEdgeCount(() => {
                updateNodeInternals(id)
                return connectedEdges.length
            })
        }
        return connectedEdges
    })
}


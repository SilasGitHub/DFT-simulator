// dynamically create more handles
import React from "react"
import {useStore, useUpdateNodeInternals} from "reactflow"
import {parseHandleId} from "./idParser.ts"

export const useDynamicHandles = (id: string, handleType?: string) => {
    const [edgeCount, setEdgeCount] = React.useState(0)
    const updateNodeInternals = useUpdateNodeInternals()
    return useStore((s) => {

        const connectedEdges = s.edges.filter((e) => {
            const {handleType: parsedHandleType} = parseHandleId(e.targetHandle)
            return e.target === id && (handleType ? handleType === parsedHandleType : true)
        })
        if (connectedEdges.length !== edgeCount) {
            setEdgeCount(() => {
                updateNodeInternals(id)
                return connectedEdges.length
            })
        }
        return connectedEdges
    })
}


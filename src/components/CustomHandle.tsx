import React, { useMemo } from 'react';
import { getConnectedEdges, Handle, useNodeId, useNodes, useStore } from 'reactflow';

// Taken from: https://reactflow.dev/examples/nodes/connection-limit

const selector = (s) => ({
    nodeInternals: s.nodeInternals,
    edges: s.edges,
});

export default function CustomHandle(props) {
    const { nodeInternals, edges } = useStore(selector);
    const nodeId = useNodeId();

    const isHandleConnectable = useMemo(() => {
        if (typeof props.isConnectable === 'number') {
            const node = nodeInternals.get(nodeId);
            let connectedEdges = getConnectedEdges([node], edges).filter((value, idx, obj) => {return value.targetHandle === props.id && value.target == nodeId});
            return connectedEdges.length < props.isConnectable;
        }

        return props.isConnectable;
    }, [nodeInternals, edges, nodeId, props.isConnectable]);

    return (
        <Handle {...props} isConnectable={isHandleConnectable}></Handle>
    );
};


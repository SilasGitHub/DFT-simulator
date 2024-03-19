import React from 'react'
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow'
import 'reactflow/dist/style.css';import EventNode from './nodes/EventNode';
``

const nodeTypes = { sourceNode: EventNode };

export default function FlowDisplay() {
    return (
        <ReactFlow
        nodes={[ { id: '2', data: { label: 'A' }, position: { x: 100, y: 200 }, type: 'sourceNode' }]}
        edges={[]}
        nodeTypes={nodeTypes}
        // onNodesChange={onNodesChange}
        // onEdgesChange={onEdgesChange}
        // onConnect={onConnect}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    );
}
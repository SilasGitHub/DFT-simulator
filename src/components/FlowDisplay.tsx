import React from 'react'
import ReactFlow, { Background, Controls, MiniMap, ReactFlowProvider, useNodesState, useEdgesState, addEdge, getConnectedEdges} from 'reactflow'
import 'reactflow/dist/style.css';import EventNode from './nodes/EventNode';
import OrNode from './nodes/OrNode';
import AndNode from './nodes/AndNode';
import SpareNode from './nodes/SpareNode';
import FDEPNode from './nodes/FdepNode';
import XOrNode from './nodes/XorNode';
import PAndNode from './nodes/PAndNode';
import expore_fdep from '../utils/FDEPChecker';
``

const nodeTypes = { sourceNode: EventNode, orNode: OrNode, xorNode: XOrNode, andNode: AndNode, pandNode: PAndNode, spareNode: SpareNode, fdep: FDEPNode};

const initialNodes = [      // { id: '2', data: { label: 'A' }, position: { x: 100, y: 200 }, type: 'sourceNode' },
//{ id: '1', data: { label: 'B' }, position: { x: 100, y: 200 }, type: 'orNode' },
{ id: '1', data: { label: 'C' }, position: { x: 100, y: 200 }, type: 'fdep' }]


let id = 0;
const getId = () => `dndnode_${id++}`;

export default function FlowDisplay() {
  const reactFlowWrapper = React.useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = React.useState(null);

React.useCallback(() => {console.log(getConnectedEdges(nodes, edges))}, [nodes])

  const onConnect = React.useCallback((params) => {
    // console.log(params)
    setEdges((eds) => addEdge(params, eds))
  }, []);
  
  const onDragOver = React.useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = React.useCallback(
    (event) => {
      
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );


    return (
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
      </div>
      </ReactFlowProvider>

    );
}
import React, { useEffect } from 'react'
import ReactFlow, { Background, Controls, MiniMap, ReactFlowProvider, useNodesState, useEdgesState, addEdge, getConnectedEdges} from 'reactflow'
import 'reactflow/dist/style.css';import EventNode from './nodes/EventNode';
import OrNode from './nodes/OrNode';
import AndNode from './nodes/AndNode';
import SpareNode from './nodes/SpareNode';
import FDEPNode from './nodes/FdepNode';
import XOrNode from './nodes/XorNode';
import PAndNode from './nodes/PAndNode';
import expore_fdep from '../utils/FDEPChecker';
import SystemNode from './nodes/SystemNode';
import get_edges_to_animate from '../utils/FDEPChecker';
``

const nodeTypes = {sysNode: SystemNode, sourceNode: EventNode, orNode: OrNode, xorNode: XOrNode, andNode: AndNode, pandNode: PAndNode, spareNode: SpareNode, fdep: FDEPNode};

const initialNodes = [      // { id: '2', data: { label: 'A' }, position: { x: 100, y: 200 }, type: 'sourceNode' },
//{ id: '1', data: { label: 'B' }, position: { x: 100, y: 200 }, type: 'orNode' },
{ id: '1', data: {}, position: { x: 100, y: 200 }, type: 'sysNode' }]

const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

let id = 0;
const getId = () => `dndnode_${id++}`;

export default function FlowDisplay() {
  const reactFlowWrapper = React.useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = React.useState(null);
  const [updateFail, doUpdateFail] = React.useState<number | null>()

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
        data: { label: `${alphabet[id % alphabet.length]}` },
      };

      if (type == "sourceNode") {
        newNode.data = {...newNode.data, failed: null}
        console.log(newNode);
      }

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

    const update = React.useEffect(()=> {
      if (!updateFail) {
        return
      }
      doUpdateFail(null)

      const start_node = nodes.find((val, idx, arr) => {return val.type === "sysNode"});
      if (start_node == null) {
        return;
      }
  
      const [failed, edges_to_animate] = get_edges_to_animate(start_node, nodes, edges);
      console.log("AAA")
      console.log(edges_to_animate)
      setEdges((edgs) => {
        return edgs.map((ed) => {
          if (edges_to_animate.includes(ed)) {
            ed.animated = true
          } else {
            ed.animated = false
          }
          return ed
        })
      })
    }, [edges, nodes]);

  const onConnectWrap = (params) => {
    onConnect(params)
    doUpdateFail(Date.now());
  }

  const onNodeClick = (ev, node) => {
    if (node.type !== "sourceNode") {
      return;
    }

    setNodes((nds) => {
      doUpdateFail(Date.now());
      return nds.map((nd) => {
        if (nd.id == node.id) {
          nd.data = {
            ...nd.data,
            failed: nd.data.failed ? null : Date.now()
          }
        }

        return nd;
      });
    });

  }

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
        onConnect={onConnectWrap}
        onNodeDoubleClick={onNodeClick}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
      </div>
      </ReactFlowProvider>

    );
}
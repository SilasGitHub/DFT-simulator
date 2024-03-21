import React from 'react'

export default function Toolbar() {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
      };
    
      return (
        <aside className="node-drag">
          <div className="dndnode" onDragStart={(event) => onDragStart(event, 'sourceNode')} draggable>
            Fail Event
          </div>
          <div className="dndnode" onDragStart={(event) => onDragStart(event, 'andNode')} draggable>
            AND
          </div>
          <div className="dndnode" onDragStart={(event) => onDragStart(event, 'pandNode')} draggable>
            PAND
          </div>
          <div className="dndnode" onDragStart={(event) => onDragStart(event, 'orNode')} draggable>
            OR
          </div>
          <div className="dndnode" onDragStart={(event) => onDragStart(event, 'xorNode')} draggable>
            XOR
          </div>
          <div className="dndnode" onDragStart={(event) => onDragStart(event, 'fdep')} draggable>
            FDEP
          </div>
          <div className="dndnode" onDragStart={(event) => onDragStart(event, 'spareNode')} draggable>
            SPARE
          </div>
        </aside>
      );
}
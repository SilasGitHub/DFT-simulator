import React from 'react'
import { Handle, Position } from 'reactflow';

export default function EventNode({data, isConnectable}) {
    return (
        <div className="dot gate">
            <p>{data.label}</p>
          <Handle type="source" position={Position.Top} isConnectable={isConnectable} />
        </div>
      );
}
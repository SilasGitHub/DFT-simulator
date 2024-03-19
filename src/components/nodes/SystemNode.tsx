import React from 'react'
import { Handle, Position } from 'reactflow';

export default function EventNode({data, isConnectable}) {
    return (
        <div className="dot">
            <Handle type="target" position={Position.Bottom} isConnectable={isConnectable} />
            <p>{data.label}</p>
        </div>
      );
}
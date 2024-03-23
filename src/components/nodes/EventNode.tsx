import React from 'react'
import {Position, useNode} from 'reactflow';
import CustomHandle from '../CustomHandle';

export default function EventNode({data, isConnectable}) {
    const color = data.failed == true ? 'red' : 'green'
    return (
        <div className="dot gate" style={{backgroundColor: color}}>
          <p>{data.label}</p>
          <CustomHandle type="source" position={Position.Top} id='a' isConnectable={isConnectable} />
        </div>
      );
}
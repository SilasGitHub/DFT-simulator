import React from 'react'
import {Position } from 'reactflow';
import CustomHandle from '../CustomHandle';

export default function SystemNode({data, isConnectable}) {
    return (
        <div className='gate dot'>
            <CustomHandle type="target" position={Position.Bottom} id='a' isConnectable={1} />
            <p>SYS</p>
        </div>
      );
}
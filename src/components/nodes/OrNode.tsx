import React from 'react'
import { Handle, Position } from 'reactflow';
import SvgOr from './../../img/or.svg';

export default function OrNode({data, isConnectable}) {
    return (
        <div style={{height: "100px", width: "100px"}}>
            <p>{data.label}</p>
            <Handle type="target" position={Position.Bottom} isConnectable={isConnectable} />
            <img src={SvgOr}/>
        </div>
      );
}
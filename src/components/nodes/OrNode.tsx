import React from 'react'
import { Handle, Position } from 'reactflow';
import SvgOr from './../../img/or.svg';

export default function OrNode({data, isConnectable}) {
    return (
        <div className='gate or'>
            {/* <p>{data.label}</p> */}
            <Handle type="target" position={Position.Bottom} style={{left: 20, right: 'auto'}} id='a' isConnectable={isConnectable} />
            <Handle type="target" position={Position.Bottom} style={{right: 12, left: 'auto'}} id='b' isConnectable={isConnectable} />
            <Handle type="source" position={Position.Top} id='c' isConnectable={isConnectable} />
            <img className='gate-img' style={{transformOrigin: 'center', transform: 'rotate(-90deg)'}} src={SvgOr}/>
        </div>
      );
}
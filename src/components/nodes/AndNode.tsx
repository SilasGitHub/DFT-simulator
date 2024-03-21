import React from 'react'
import { Handle, Position } from 'reactflow';
import AndSvg from './../../img/and.svg';

export default function AndNode({data, isConnectable}) {
    return (
        <div className='gate and'>
            {/* <p>{data.label}</p> */}
            <Handle type="target" position={Position.Bottom} style={{left: 20, right: 'auto'}} id='a' isConnectable={isConnectable} />
            <Handle type="target" position={Position.Bottom} style={{right: 12, left: 'auto'}} id='b' isConnectable={isConnectable} />
            <Handle type="source" position={Position.Top} id='c' isConnectable={isConnectable} />
            <img className='gate-img' style={{transformOrigin: 'center', transform: 'rotate(-90deg)'}} src={AndSvg}/>
        </div>
      );
}
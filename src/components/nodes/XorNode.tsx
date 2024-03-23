import React from 'react'
import {NodeResizer, Position } from 'reactflow';
import SvgXOr from './../../img/xor.svg';
import CustomHandle from '../CustomHandle';

export default function XOrNode({data, isConnectable, selected}) {
    return (
        <div className='gate or'>
            {/* <p>{data.label}</p> */}
            {/* <NodeResizer isVisible={selected} minWidth={60} minHeight={100} keepAspectRatio={true} /> */}
            <CustomHandle type="target" position={Position.Bottom} style={{left: "20%"}} id='b' isConnectable={1} />
            <CustomHandle type="target" position={Position.Bottom} style={{right: "20%", left: 'auto'}} id='a' isConnectable={1} />
            <CustomHandle type="source" position={Position.Top} id='c' isConnectable={isConnectable} />
            <img className='gate-img' style={{transformOrigin: 'center', transform: 'rotate(-90deg)'}} src={SvgXOr}/>
        </div>
      );
}
import React from 'react'
import { NodeResizer, Position } from 'reactflow';
import PAndSvg from './../../img/pand.svg';
import CustomHandle from '../CustomHandle';

export default function PAndNode({data, isConnectable, selected}) {
    return (
        <div className='gate and'>
            {/* <NodeResizer isVisible={selected} minWidth={60} minHeight={100} keepAspectRatio={true} /> */}
            <CustomHandle type="target" position={Position.Bottom} style={{left: "20%"}} id='a' isConnectable={1} />
            <CustomHandle type="target" position={Position.Bottom} style={{right: "20%", left: 'auto'}} id='b' isConnectable={1} />
            <CustomHandle type="source" position={Position.Top} id='c' isConnectable={isConnectable} />
            <img className='gate-img' style={{transformOrigin: 'center', transform: 'rotate(-90deg)'}} src={PAndSvg}/>
        </div>
      );
}
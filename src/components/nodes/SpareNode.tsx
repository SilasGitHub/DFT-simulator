import React from 'react'
import { Handle, Position } from 'reactflow';
import SvgOr from './../../img/or.svg';

export default function SpareNode({data, isConnectable}) {
    return (
        <div className='gate spare'>
            <p>{data.label}</p>
            <Handle type="target" position={Position.Top} id="a" isConnectable={isConnectable} />
            <Handle type="source" position={Position.Bottom} id='c' isConnectable={isConnectable} style={{right: 21, left: 'auto'}}/>
            <div style={{height: "20%", borderTop: "1px solid black", display: "flex", flexDirection: "row", justifyContent: "space-between", textAlign: "center"}}>
                <div style={{display: "flex", flexGrow: 2, alignItems: "center", justifyContent: "center"}}>
                    <p>SPARE</p>
                </div>
                <div style={{flexGrow: 2, borderLeft: "1px solid black"}}>

                </div>
            </div>
        </div>
      );
}
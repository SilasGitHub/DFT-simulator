import React from 'react'
import { Handle, Position } from 'reactflow';
import SvgOr from './../../img/or.svg';

export default function FDEPNode({data, isConnectable}) {
    return (
        <div className='gate spare'>
            <p>{data.label}</p>
            <Handle type="source" position={Position.Top} id="a" isConnectable={isConnectable} />
            <Handle type="target" position={Position.Bottom} id='c' isConnectable={isConnectable} style={{right: 15, left: 'auto'}}/>
            <Handle type="target" position={Position.Left} id="a" isConnectable={isConnectable} style={{top: 'auto', bottom: '2px'}}/>
            <div style={{height: "20%", borderTop: "1px solid black", display: "flex", flexDirection: "row", justifyContent: "space-between", textAlign: "center"}}>
                <div style={{flexGrow: 2}} className='arrow-right'></div>
                <div style={{flexGrow: 1, borderLeft: "1px solid black"}}>

                </div>
            </div>
        </div>
      );
}
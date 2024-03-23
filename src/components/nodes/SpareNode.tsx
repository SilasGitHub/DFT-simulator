import React from 'react'
import { Position } from 'reactflow';
import SvgOr from './../../img/or.svg';
import CustomHandle from '../CustomHandle';

export default function SpareNode({data, isConnectable}) {
    return (
        <div className='gate spare' style={{justifyContent: 'flex-end'}}>
            <CustomHandle type="source" position={Position.Top} id='a' isConnectable={isConnectable} />
            <CustomHandle type="target" position={Position.Bottom} id='b' isConnectable={isConnectable} style={{right: 21, left: 'auto'}}/>
            <CustomHandle type="target" position={Position.Left} id='c' isConnectable={1} style={{top: 'auto', bottom: '3px'}}/>
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
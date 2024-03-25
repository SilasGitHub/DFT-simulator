import {NodeProps, Position} from "reactflow"
import CustomHandle from '../CustomHandle';
import {SpareNodeData} from "./Nodes"

export default function SpareNode({data}: NodeProps<SpareNodeData>) {
	const color = data.failed !== null ? (data.failed ? 'red' : 'green') : '';
    return (
        <div className='gate spare' style={{backgroundColor: color, justifyContent: 'flex-end'}}>
            <CustomHandle type="target" position={Position.Bottom} id='spare-b' isConnectable style={{right: 21, left: 'auto'}}/>
            <CustomHandle type="target" position={Position.Left} id='primary-a' isConnectable={1} style={{top: 'auto', bottom: '3px'}}/>
            <CustomHandle type="source" position={Position.Top} id='c' isConnectable={true} />
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
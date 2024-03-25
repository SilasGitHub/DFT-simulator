import {NodeProps, Position} from "reactflow"
import CustomHandle from '../CustomHandle';
import {FdepNodeData} from "./Nodes"


export default function FDEPNode({data}: NodeProps<FdepNodeData>) {
	const color = data.failed !== null ? (data.failed ? 'red' : 'green') : '';
    return (
        <div className='gate spare' style={{backgroundColor: color, justifyContent: 'flex-end'}}>
                        {/* <NodeResizer isVisible={selected} minWidth={60} minHeight={100} keepAspectRatio={true} /> */}

            {/* <p>{data.label}</p> */}
            <CustomHandle type="source" position={Position.Top} id='a' isConnectable={1} />
            <CustomHandle type="target" position={Position.Bottom} id='dependent-b' isConnectable style={{right: "12%", left: 'auto'}}/>
            <CustomHandle type="target" position={Position.Left} id='trigger-c' isConnectable={1} style={{top: 'auto', bottom: '2px'}}/>

            <div style={{height: "20%", borderTop: "1px solid black", display: "flex", flexDirection: "row", justifyContent: "space-betweem", textAlign: "center"}}>
                <div style={{flexGrow: 2}} className='arrow-right'></div>
                <div style={{flexGrow: 1, borderLeft: "1px solid black"}}>

                </div>
            </div>
        </div>
      );
}
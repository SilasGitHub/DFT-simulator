import {NodeProps, Position} from "reactflow"
import AndSvg from "./../../img/and.svg"
import CustomHandle from "../CustomHandle"
import {AndNodeData} from "./Nodes"


export default function AndNode({data}: NodeProps<AndNodeData>) {
	const color = data.failed !== null ? (data.failed ? 'red' : 'green') : '';
    return (
        <>
            {/* <NodeResizer isVisible={selected} minWidth={60} minHeight={100} keepAspectRatio={true} /> */}
            <CustomHandle type="target" position={Position.Bottom} id="a" style={{right: "20%", left: "auto"}} isConnectable={1}/>
            <CustomHandle type="target" position={Position.Bottom} id="b" style={{left: "20%"}} isConnectable={1}/>
            <CustomHandle type="source" position={Position.Top} id="c" isConnectable={true}/>
            <div className="gate and">
                <img className="gate-img" style={{backgroundColor: color, transformOrigin: "center", transform: "rotate(-90deg)"}}
                     src={AndSvg}/>
            </div>
        </>
    )
}
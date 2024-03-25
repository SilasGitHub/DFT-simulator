import {NodeProps, Position} from "reactflow"
import PAndSvg from './../../img/pand.svg';
import CustomHandle from '../CustomHandle';
import {PAndNodeData} from "./Nodes"


export default function PAndNode({data}: NodeProps<PAndNodeData>) {
	const color = data.failed !== null ? (data.failed ? 'red' : 'green') : '';
    return (
        <div className='gate and'>
            {/* <NodeResizer isVisible={selected} minWidth={60} minHeight={100} keepAspectRatio={true} /> */}
            <CustomHandle type="target" position={Position.Bottom} style={{left: "20%"}} id='a' isConnectable={1} />
            <CustomHandle type="target" position={Position.Bottom} style={{right: "20%", left: 'auto'}} id='b' isConnectable={1} />
            <CustomHandle type="source" position={Position.Top} id='c' isConnectable={true} />
            <img className='gate-img' style={{backgroundColor: color, transformOrigin: 'center', transform: 'rotate(-90deg)'}} src={PAndSvg}/>
        </div>
      );
}
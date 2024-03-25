import {NodeProps, Position} from "reactflow"
import CustomHandle from '../CustomHandle';
import {SystemNodeData} from "./Nodes"

export default function SystemNode({data}: NodeProps<SystemNodeData>) {
	const color = data.failed !== null ? (data.failed ? 'red' : 'green') : '';
    return (
        <div className='gate dot' style={{backgroundColor: color}}>
            <CustomHandle type="target" position={Position.Bottom} id='a' isConnectable={1} />
            <p>{data.label}</p>
        </div>
      );
}
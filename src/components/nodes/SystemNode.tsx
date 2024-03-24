import {NodeProps, Position} from "reactflow"
import CustomHandle from '../CustomHandle';
import {SystemNodeData} from "./Nodes"

export default function SystemNode({data}: NodeProps<SystemNodeData>) {
    return (
        <div className='gate dot'>
            <CustomHandle type="target" position={Position.Bottom} id='a' isConnectable={1} />
            <p>{data.label}</p>
        </div>
      );
}
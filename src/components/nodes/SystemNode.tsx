import {NodeProps, Position} from "reactflow"
import CustomHandle from '../CustomHandle';
import {NodeType, SystemNodeData} from "./Nodes"
import {createHandleId} from "../../utils/idParser.ts"

export default function SystemNode({data}: NodeProps<SystemNodeData>) {
	const color = data.failed !== null ? (data.failed ? 'red' : 'green') : '';
    return (
        <div className='entity dot-autoscale' style={{backgroundColor: color, }}>
            <CustomHandle
                type="target"
                position={Position.Bottom}
                id={createHandleId(NodeType.SYSTEM_NODE, "output")}
                isConnectable={1}
            />
            <p>{data.label}</p>
        </div>
      );
}
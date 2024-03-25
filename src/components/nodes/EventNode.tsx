import {NodeProps, Position} from "reactflow"
import CustomHandle from '../CustomHandle';
import {EventNodeData} from "./Nodes.ts"


export default function EventNode({data}: NodeProps<EventNodeData>) {
    const color = data.failed !== null ? (data.failed ? 'red' : 'green') : '';
    return (
        <div className="entity dot" style={{backgroundColor: color}}>
          <p>{data.label}</p>
          <CustomHandle type="source" position={Position.Top} id='a' isConnectable={true} />
        </div>
      );
}
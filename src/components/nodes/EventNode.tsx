import {NodeProps, Position} from "reactflow"
import CustomHandle from '../CustomHandle';
import {EventNodeData, NodeType} from "./Nodes.ts"
import {createHandleId} from "../../utils/idParser.ts"


export default function EventNode({data}: NodeProps<EventNodeData>) {
    const color = data.failed !== null ? (data.failed ? 'red' : 'green') : '';
    return (
        <div className="entity dot" style={{backgroundColor: color}}>
          <p>{data.label}</p>
          <CustomHandle
              type="source"
              position={Position.Top}
              id={createHandleId(NodeType.EVENT_NODE, "output")}
              isConnectable={true}
          />
        </div>
      );
}
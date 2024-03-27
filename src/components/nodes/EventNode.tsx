import {NodeProps, Position} from "reactflow"
import CustomHandle from "../CustomHandle"
import {EventNodeData, NodeType} from "./Nodes.ts"
import {createHandleId} from "../../utils/idParser.ts"
import EventIcon from "../node-icons/EventIcon.tsx"


export default function EventNode({data}: NodeProps<EventNodeData>) {
    return (
        <div>
            <CustomHandle
                type="source"
                position={Position.Top}
                id={createHandleId(NodeType.EVENT_NODE, "output")}
                isConnectable={true}
            />
            <EventIcon label={data.label} failed={data.failed}/>
        </div>
    )
}
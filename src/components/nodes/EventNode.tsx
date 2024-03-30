import {NodeProps, Position} from "reactflow"
import CustomHandle from "../CustomHandle"
import {EventNodeData, NodeType} from "./Nodes.ts"
import {createHandleId} from "../../utils/idParser.ts"
import EventIcon from "../node-icons/EventIcon.tsx"
import {useDiagramAnimationStore} from "../../stores/useDiagramAnimationStore.ts"


export default function EventNode({id, data}: NodeProps<EventNodeData>) {
    const {getNodeFailState} = useDiagramAnimationStore()
    const failed = getNodeFailState(id)

    return (
        <div>
            <CustomHandle
                type="source"
                position={Position.Top}
                id={createHandleId(NodeType.EVENT_NODE, "output")}
                isConnectable={true}
            />
            <EventIcon label={data.label} failed={failed}/>
        </div>
    )
}
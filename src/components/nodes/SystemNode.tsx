import {NodeProps, Position} from "reactflow"
import CustomHandle from "../CustomHandle"
import {NodeType, SystemNodeData} from "./Nodes"
import {createHandleId} from "../../utils/idParser.ts"
import SystemIcon from "../node-icons/SystemIcon.tsx"
import {useDiagramAnimationStore} from "../../stores/useDiagramAnimationStore.ts"

export default function SystemNode({id, data}: NodeProps<SystemNodeData>) {
    const {getNodeFailState} = useDiagramAnimationStore()
    const failed = getNodeFailState(id)

    return (
        <div>
            <CustomHandle
                type="target"
                position={Position.Bottom}
                id={createHandleId(NodeType.SYSTEM_NODE, "output")}
                isConnectable={1}
            />
            <SystemIcon label={data.label} failed={failed}/>
        </div>
    )
}
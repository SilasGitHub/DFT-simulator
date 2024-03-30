import {NodeProps, Position} from "reactflow"
import CustomHandle from "../CustomHandle"
import {FdepNodeData, NodeType} from "./Nodes"
import {useDynamicHandles} from "../../utils/useDynamicHandles.tsx"
import {createHandleId} from "../../utils/idParser.ts"
import FdepIcon from "../node-icons/FdepIcon.tsx"
import {useDiagramAnimationStore} from "../../stores/useDiagramAnimationStore.ts"

export default function FDEPNode({id, data}: NodeProps<FdepNodeData>) {
    // dynamically create more handles
    const connectedSources = useDynamicHandles(id, "dependent")
    const nHandles = Math.max(connectedSources.length + 1, 1)
    const spacing = 80 / (nHandles + 1)

    const {getNodeFailState} = useDiagramAnimationStore()
    const failed = getNodeFailState(id)

    return (
        <div>
            <CustomHandle
                type="target"
                position={Position.Left}
                id={createHandleId(NodeType.FDEP_NODE, "trigger")}
                isConnectable={1}
                style={{top: "auto", bottom: "10px"}}
            />

            <CustomHandle
                type="target"
                position={Position.Bottom}
                style={{left: (20 + spacing) + "%"}}
                id={createHandleId(NodeType.FDEP_NODE, "dependent", 1)}
                isConnectable={1}
            />
            {connectedSources.map((edge, i) => (
                <CustomHandle
                    type="target"
                    position={Position.Bottom}
                    id={createHandleId(NodeType.FDEP_NODE, "dependent", i + 2)}
                    key={edge.id + edge.targetHandle}
                    style={{left: 20 + (spacing * (i + 2)) + "%"}}
                    isConnectable={1}
                />
            ))}

            <div className="entity">
                <FdepIcon label={data.label} failed={failed}/>
            </div>
        </div>
    )
}
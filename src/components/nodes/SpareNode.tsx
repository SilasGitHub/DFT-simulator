import {NodeProps, Position} from "reactflow"
import CustomHandle from "../CustomHandle"
import {NodeType, SpareNodeData} from "./Nodes"
import {useDynamicHandles} from "../../utils/useDynamicHandles.tsx"
import {createHandleId} from "../../utils/idParser.ts"
import SpareIcon from "../node-icons/SpareIcon.tsx"
import {useDiagramAnimationStore} from "../../stores/useDiagramAnimationStore.ts"

export default function SpareNode({id, data}: NodeProps<SpareNodeData>) {
    // dynamically create more handles
    const connectedSources = useDynamicHandles(id, "spare")
    const nHandles = Math.max(connectedSources.length + 1, 1)
    const spacing = 80 / (nHandles + 1)

    const {getNodeFailState} = useDiagramAnimationStore()
    const failed = getNodeFailState(id)

    return (
        <div>
            <CustomHandle
                type="source"
                position={Position.Top}
                id={createHandleId(NodeType.SPARE_NODE, "output")}
                isConnectable={true}
            />
            <CustomHandle
                type="target"
                position={Position.Left}
                id={createHandleId(NodeType.SPARE_NODE, "primary")}
                isConnectable={1}
                style={{top: "auto", bottom: "10px"}}
            />

            <CustomHandle
                type="target"
                position={Position.Bottom}
                style={{left: (20 + spacing) + "%"}}
                id={createHandleId(NodeType.SPARE_NODE, "spare", 1)}
                isConnectable={1}
            />
            {connectedSources.map((edge, i) => (
                <CustomHandle
                    type="target"
                    position={Position.Bottom}
                    id={createHandleId(NodeType.SPARE_NODE, "spare", i + 2)}
                    key={edge.id + edge.targetHandle}
                    style={{left: 20 + (spacing * (i + 2)) + "%"}}
                    isConnectable={1}
                />
            ))}

            <div className="entity">
                <SpareIcon label={data.label} failed={failed}/>
            </div>
        </div>
    )
}
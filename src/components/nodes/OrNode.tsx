import {NodeProps, Position} from "reactflow"
import SvgOr from "./../../img/or.svg"
import CustomHandle from "../CustomHandle"
import {NodeType, OrNodeData} from "./Nodes"
import {useDynamicHandles} from "../../utils/useDynamicHandles.tsx"
import {createHandleId} from "../../utils/idParser.ts"

export default function OrNode({id, data}: NodeProps<OrNodeData>) {
    const color = data.failed !== null ? (data.failed ? 'red' : 'green') : '';

    // dynamically create more handles
    const connectedSources = useDynamicHandles(id)
    const nHandles = Math.max(connectedSources.length + 1, 2)
    const spacing = 100 / (nHandles + 1)

    return (
        <div className="entity or">
            {/* <NodeResizer isVisible={selected} minWidth={60} minHeight={100} keepAspectRatio={true} /> */}
            {/* <p>{data.label}</p> */}
            <CustomHandle
                type="source"
                position={Position.Top}
                id={createHandleId(NodeType.OR_NODE, "output")}
                isConnectable={true}
            />
            <CustomHandle
                type="target"
                position={Position.Bottom}
                style={{ left: spacing + "%" }}
                id={createHandleId(NodeType.OR_NODE, "input", 1)}
                isConnectable={1}
            />
            <CustomHandle
                type="target"
                position={Position.Bottom}
                style={{ left: spacing * 2 + "%" }}
                id={createHandleId(NodeType.OR_NODE, "input", 2)}
                isConnectable={1}
            />
            {connectedSources.slice(1).map((edge, i) => (
                <CustomHandle
                    type="target"
                    position={Position.Bottom}
                    id={createHandleId(NodeType.OR_NODE, "input", i + 3)}
                    key={edge.id + edge.targetHandle}
                    style={{ left: spacing * (i + 3) + "%" }}
                    isConnectable={1}
                />
            ))}
            <img className="gate-img" style={{backgroundColor: color}} src={SvgOr}/>
        </div>
    )
}
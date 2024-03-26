import {NodeProps, Position} from "reactflow"
import AndSvg from "./../../img/and.svg"
import CustomHandle from "../CustomHandle"
import {AndNodeData, NodeType} from "./Nodes"
import {useDynamicHandles} from "../../utils/useDynamicHandles.tsx"
import {createHandleId} from "../../utils/idParser.ts"


export default function AndNode({id, data}: NodeProps<AndNodeData>) {
	const color = data.failed !== null ? (data.failed ? 'red' : 'green') : '';

    // dynamically create more handles
    const connectedSources = useDynamicHandles(id);
    const nHandles = Math.max(connectedSources.length + 1, 2);
    const spacing = 100 / (nHandles + 1);

    return (
        <>
            {/* <NodeResizer isVisible={selected} minWidth={60} minHeight={100} keepAspectRatio={true} /> */}
            <CustomHandle
                type="source"
                position={Position.Top}
                id={createHandleId(NodeType.AND_NODE, "output")}
                isConnectable={true}
                className="handle"
            />
            <CustomHandle
                type="target"
                position={Position.Bottom}
                id={createHandleId(NodeType.AND_NODE, "input", 1)}
                style={{ left: spacing + "%" }}
                isConnectable={1}
            />
            <CustomHandle
                type="target"
                position={Position.Bottom}
                id={createHandleId(NodeType.AND_NODE, "input", 2)}
                style={{ left: spacing * 2 + "%" }}
                isConnectable={1}
            />
            {connectedSources.slice(1).map((edge, i) => (
                <CustomHandle
                    type="target"
                    position={Position.Bottom}
                    id={createHandleId(NodeType.AND_NODE, "input", i + 3)}
                    key={edge.id + edge.targetHandle}
                    style={{ left: spacing * (i + 3) + "%" }}
                    isConnectable={1}
                />
            ))}
            <div className="entity and">
                <img
                    className="gate-img"
                    style={{backgroundColor: color}}
                    src={AndSvg}
                />
            </div>
        </>
    )
}
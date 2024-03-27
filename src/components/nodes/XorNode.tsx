import {NodeProps, Position} from "reactflow"
import CustomHandle from "../CustomHandle"
import {NodeType, XorNodeData} from "./Nodes"
import {useDynamicHandles} from "../../utils/useDynamicHandles.tsx"
import {createHandleId} from "../../utils/idParser.ts"
import XorIcon from "../node-icons/XorIcon.tsx"
import classNames from "classnames"

export default function XOrNode({id, data}: NodeProps<XorNodeData>) {
    // dynamically create more handles
    const connectedSources = useDynamicHandles(id)
    const nHandles = Math.max(connectedSources.length + 1, 2)
    const spacing = 100 / (nHandles + 1)

    return (
        <div>
            <CustomHandle
                type="source"
                position={Position.Top}
                id={createHandleId(NodeType.XOR_NODE, "output")}
                isConnectable={true}
            />
            <CustomHandle
                type="target"
                position={Position.Bottom}
                style={{left: spacing + "%"}}
                id={createHandleId(NodeType.XOR_NODE, "input", 1)}
                isConnectable={1}
            />
            <CustomHandle
                type="target"
                position={Position.Bottom}
                style={{left: spacing * 2 + "%"}}
                id={createHandleId(NodeType.XOR_NODE, "input", 2)}
                isConnectable={1}
            />
            {connectedSources.slice(1).map((edge, i) => (
                <CustomHandle
                    type="target"
                    position={Position.Bottom}
                    id={createHandleId(NodeType.XOR_NODE, "input", i + 3)}
                    key={edge.id + edge.targetHandle}
                    style={{left: spacing * (i + 3) + "%"}}
                    isConnectable={1}
                />
            ))}
            <div
                className={classNames(
                    "icon-bordered py-2 px-8",
                    data?.failed !== null && data?.failed !== undefined ? (data?.failed > 0 ? "bg-failed" : "bg-success") : "",
                )}
            >
                <XorIcon label={data.label} failed={data.failed}/>
            </div>
        </div>
    )
}
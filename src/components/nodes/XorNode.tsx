import {NodeProps, Position} from "reactflow"
import SvgXOr from "./../../img/xor.svg"
import CustomHandle from "../CustomHandle"
import {XorNodeData} from "./Nodes"
import {useDynamicHandles} from "../../utils/useDynamicHandles.tsx"

export default function XOrNode({id}: NodeProps<XorNodeData>) {
    // dynamically create more handles
    const connectedSources = useDynamicHandles(id)
    const nHandles = Math.max(connectedSources.length + 1, 2)
    const spacing = 100 / (nHandles + 1)

    return (
        <div className="entity or">
            <CustomHandle type="source" position={Position.Top} id="c" isConnectable={true}/>
            <CustomHandle
                type="target"
                position={Position.Bottom}
                style={{ left: spacing + "%" }}
                id="b"
                isConnectable={1}
            />
            <CustomHandle
                type="target"
                position={Position.Bottom}
                style={{ left: spacing * 2 + "%" }}
                id="a"
                isConnectable={1}
            />
            {connectedSources.slice(1).map((edge, i) => (
                <CustomHandle
                    type="target"
                    position={Position.Bottom}
                    id={edge.id + edge.targetHandle}
                    key={edge.id + edge.targetHandle}
                    style={{ left: spacing * (i + 3) + "%" }}
                    isConnectable={1}
                />
            ))}
            <img className="gate-img" style={{transformOrigin: "center", transform: "rotate(-90deg)"}} src={SvgXOr}/>
        </div>
    )
}
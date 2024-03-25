import {NodeProps, Position} from "reactflow"
import SvgOr from "./../../img/or.svg"
import CustomHandle from "../CustomHandle"
import {OrNodeData} from "./Nodes"
import {useDynamicHandles} from "../../utils/useDynamicHandles.tsx"

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
            <CustomHandle type="source" position={Position.Top} id="c" isConnectable={true}/>
            <CustomHandle
                type="target"
                position={Position.Bottom}
                style={{ left: spacing + "%" }}
                id="a"
                isConnectable={1}
            />
            <CustomHandle
                type="target"
                position={Position.Bottom}
                style={{ left: spacing * 2 + "%" }}
                id="b"
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
            <img className="gate-img" style={{backgroundColor: color, transformOrigin: "center", transform: "rotate(-90deg)"}} src={SvgOr}/>
        </div>
    )
}
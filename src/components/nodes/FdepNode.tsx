import {NodeProps, Position} from "reactflow"
import CustomHandle from "../CustomHandle"
import {FdepNodeData} from "./Nodes"
import {useDynamicHandles} from "../../utils/useDynamicHandles.tsx"


export default function FDEPNode({id}: NodeProps<FdepNodeData>) {
    // dynamically create more handles
    const connectedSources = useDynamicHandles(id, "dependent_")
    const nHandles = Math.max(connectedSources.length + 1, 1)
    const spacing = 80 / (nHandles + 1)

    return (
        <div className="entity spare" style={{justifyContent: "flex-end"}}>
            {/*<CustomHandle type="source" position={Position.Top} id="a" isConnectable={1}/>*/}
            <CustomHandle
                type="target"
                position={Position.Left}
                id="trigger"
                isConnectable={1}
                style={{top: "auto", bottom: "10px"}}
            />

            <CustomHandle
                type="target"
                position={Position.Bottom}
                style={{left: (20 + spacing) + "%"}}
                id="dependent_1"
                isConnectable={1}
            />
            {connectedSources.map((edge, i) => (
                <CustomHandle
                    type="target"
                    position={Position.Bottom}
                    id={"dependent_" + edge.id + edge.targetHandle}
                    key={edge.id + edge.targetHandle}
                    style={{left: 20 + (spacing * (i + 2)) + "%"}}
                    isConnectable={1}
                />
            ))}

            <p>FDEP</p>
            <div style={{borderTop: "2px solid black"}}>
                <div className="arrow-right"></div>
            </div>
        </div>
    )
}
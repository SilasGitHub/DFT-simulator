import AndSvg from "./../../img/and.svg"
import {AndNodeData} from "../nodes/Nodes.ts"

type AndIconProps = {
    data?: AndNodeData
}

export default function AndIcon({data}: AndIconProps) {
    const color = data?.failed ? (data.failed ? "red" : "green") : ""

    return (
        <div className="entity and">
            <img
                className="gate-img"
                style={{backgroundColor: color}}
                src={AndSvg}
            />
        </div>
    )
}
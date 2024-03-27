import classNames from "classnames"
import React from "react"
import {NodeIconProps} from "./NodeIcons"

export default function FdepIcon({
                                     failed,
                                     label,
                                     className,
                                 }: NodeIconProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    const combinedClassName = classNames(
        "icon-bordered icon-horizontal-box justify-end",
        failed !== null && failed !== undefined ? (failed > 0 ? "bg-failed" : "bg-success") : "",
        className,
    )
    return (
        <div className={combinedClassName}>
            <p>{label || "FDEP"}</p>
            <div style={{borderTop: "2px solid black"}}>
                <div className="arrow-right"></div>
            </div>
        </div>
    )
}
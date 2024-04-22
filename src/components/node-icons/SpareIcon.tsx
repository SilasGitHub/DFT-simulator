import classNames from "classnames"
import React from "react"
import {NodeIconProps} from "./NodeIcons"

export default function SpareIcon({
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
        <div
            className={combinedClassName}
        >
            <p>{label || "SPARE"}</p>
            <div style={{
                height: "40%",
                display: "flex",
            }}>
                <div style={{width: 40, display: "flex", alignItems: "center", justifyContent: "center"}}>
                </div>
                <div style={{flexGrow: 2, borderLeft: "2px solid black", borderTop: "2px solid black"}}>
                </div>
            </div>
        </div>
    )
}
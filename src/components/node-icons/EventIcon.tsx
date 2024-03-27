import classNames from "classnames"
import React from "react"
import {NodeIconProps} from "./NodeIcons"

export default function EventIcon({
                                      failed,
                                      label,
                                      className,
                                  }: NodeIconProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    const combinedClassName = classNames(
        "entity dot",
        failed !== null && failed !== undefined ? (failed > 0 ? "bg-failed" : "bg-success") : "",
        className,
    )
    return (
        <div className={combinedClassName}>
            <p>{label || "E"}</p>
        </div>
    )
}
import AndSvg from "./../../img/and.svg"
import classNames from "classnames"
import React from "react"
import {NodeIconProps} from "./NodeIcons"

export default function AndIcon({
                                    className,
                                }: NodeIconProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLImageElement>, HTMLImageElement>) {
    const combinedClassName = classNames(
        "entity gate-img",
        className,
    )
    return (
        <img
            className={combinedClassName}
            src={AndSvg}
        />
    )
}
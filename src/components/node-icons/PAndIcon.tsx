import PAndSvg from "./../../img/pand.svg"
import React from "react"
import classNames from "classnames"
import {NodeIconProps} from "./NodeIcons"

export default function PAndIcon({
                                     className,
                                 }: NodeIconProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLImageElement>, HTMLImageElement>) {
    const combinedClassName = classNames(
        "entity gate-img",
        className,
    )
    return (
        <img
            className={combinedClassName}
            src={PAndSvg}
        />
    )
}
import XorSvg from "./../../img/xor.svg"
import classNames from "classnames"
import {NodeIconProps} from "./NodeIcons"

export default function XorIcon({
                                    className,
                                }: NodeIconProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLImageElement>, HTMLImageElement>) {
    const combinedClassName = classNames(
        "entity gate-img",
        className,
    )
    return (
        <img
            className={combinedClassName}
            src={XorSvg}
        />
    )
}
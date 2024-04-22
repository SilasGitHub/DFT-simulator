import classNames from "classnames"
import {NodeIconProps} from "./NodeIcons"


export default function SystemIcon({
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
            <p>{label || "SYS"}</p>
        </div>
    )
}
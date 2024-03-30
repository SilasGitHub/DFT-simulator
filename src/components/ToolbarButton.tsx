import React, {ReactElement} from "react"
import classNames from "classnames"

class ToolbarButtonProps {
    children?: ReactElement
    label?: string
    disabled?: boolean = false
}

export default function ToolbarButton({children, label, disabled, className, ...rest}: ToolbarButtonProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return (
        <div
            className={classNames('toolbarbutton relative', disabled ? 'disabled' : '')}
        >
            <button
                {...rest}
                className={classNames('z-1 shadow-gray-300 border-2 border-theme-border bg-white text-black font-bold p-1.5 rounded-xl aspect-square text-3xl transition duration-150 cursor-pointer h-15 w-15 lg:h-16 lg:w-16 xl:h-17 xl:w-17 flex items-center justify-center bg-white', className)}
            >
                {children}
            </button>
            {
                label &&
                <span className="absolute -bottom-1.5 text-center w-full opacity-0 transition-opacity text-alt-2 text-xs z-0">
                    {label}
                </span>
            }
        </div>
    )
}
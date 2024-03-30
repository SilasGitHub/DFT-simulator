import React, {ReactElement} from "react"
import classNames from "classnames"

export default function ToolbarButton({children, className, ...rest}: { children: ReactElement } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return (
        <button
            {...rest}
            className={classNames('hover:shadow-md shadow-gray-300 border-2 border-theme-border bg-white text-black font-bold p-1.5 rounded-xl aspect-square text-3xl transition duration-150 cursor-pointer h-15 w-15 lg:h-16 lg:w-16 xl:h-17 xl:w-17 flex items-center justify-center bg-white', className)}
        >
            {children}
        </button>
    )
}
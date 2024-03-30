import React, {ReactElement} from "react"
import classNames from "classnames"

export default function TopbarButton({children, className, ...rest}: { children: ReactElement } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return (
        <button
            {...rest}
            className={classNames('hover:shadow-md shadow-gray-300 border-r-2.5 border-theme-border bg-white text-black font-bold p-1.5 aspect-square text-2xl transition duration-150 cursor-pointer flex items-center justify-center bg-white w-10 h-full', className)}
        >
            {children}
        </button>
    )
}
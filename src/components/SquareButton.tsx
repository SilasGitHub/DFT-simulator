import React, {ReactElement} from "react"
import classNames from "classnames"

export default function SquareButton({children, className, ...rest}: { children: ReactElement } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return (
        <button
            {...rest}
            className={classNames('button-square h-15 w-15 lg:h-16 lg:w-16 xl:h-17 xl:w-17 flex items-center justify-center bg-white', className)}
        >
            {children}
        </button>
    )
}
import React, {ReactElement} from "react"

export default function SquareButton({children, ...rest}: { children: ReactElement } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {

    return (
        <button
            {...rest}
            className="button-square h-15 w-15 flex items-center justify-center bg-white"
        >
            {children}
        </button>
    )
}
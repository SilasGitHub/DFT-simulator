import React from "react"
import classNames from "classnames"
import {useDiagramStateStore} from "../stores/useDiagramStateStore.ts"

export default function TopbarSpeedChanger({
                                               className,
                                               ...rest
                                           }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    const {animationSpeed, setAnimationSpeed} = useDiagramStateStore()

    const canDecrease = React.useMemo(() => {
        return 0.5 < animationSpeed
    }, [animationSpeed])

    return (
        <div
            {...rest}
            className={classNames("flex border-l-2.5 bg-white border-theme-border", className)}
        >
            <button
                className={classNames(
                    "hover:shadow-md shadow-gray-300 bg-white font-bold p-1.5 aspect-square text-2xl transition duration-150 cursor-pointer flex items-center justify-center bg-white w-10 h-full",
                    canDecrease ? "" : "disabled",
                )}
                disabled={!canDecrease}
                onClick={() => {
                    setAnimationSpeed(animationSpeed - 0.5)
                }}
            >
                <div className="i-mdi-arrow-down-bold"/>
            </button>
            <div className="flex font-semibold text-center w-18 items-center justify-center">
                <div className="i-mdi-play-speed !text-2xl mr-1"/>
                <div className="text-lg">
                    {animationSpeed.toFixed(1)}×
                </div>
            </div>
            <button
                className="hover:shadow-md shadow-gray-300 bg-white font-bold p-1.5 aspect-square text-2xl transition duration-150 cursor-pointer flex items-center justify-center bg-white w-10 h-full"
                onClick={() => {
                    setAnimationSpeed(animationSpeed + 0.5)
                }}
            >
                <div className="i-mdi-arrow-up-bold"/>
            </button>
        </div>
    )
}
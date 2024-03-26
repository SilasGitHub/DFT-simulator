import React, {useEffect, useState} from "react"
import SquareButton from "./SquareButton.tsx"
import Divider from "./Divider.tsx"
import OrSvg from "../img/or.svg"
import PandSvg from "../img/pand.svg"
import XorSvg from "../img/xor.svg"
import {NodeType} from "./nodes/Nodes.ts"
import AndIcon from "./entity-icons/AndIcon.tsx"

interface ToolbarProps {
    selected: Array<string>,
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
    currentlyAnimating: boolean,
    setCurrentlyAnimating: React.Dispatch<React.SetStateAction<boolean>>
}

// Reorderable ids list based on this tutorial: https://dev.to/h8moss/build-a-reorderable-list-in-react-29on
export default function Toolbar(props: ToolbarProps) {
    const [dragged, setDragged] = useState<number | null>(null)
    const [mouse, setMouse] = useState<[number, number]>([0, 0])
    const [dropZone, setDropZone] = useState(0)
    const onDragStart = (event: React.DragEvent<HTMLButtonElement>, nodeType: string) => {
        event.dataTransfer.setData("application/reactflow", nodeType)
        event.dataTransfer.effectAllowed = "move"
    }


    // get mouse coordenates
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            setMouse([e.x, e.y])
        }

        document.addEventListener("mousemove", handler)

        return () => document.removeEventListener("mousemove", handler)
    }, [])

    // get closest drop zone
    useEffect(() => {
        if (dragged !== null) {
            // get all drop-zones
            const elements = Array.from(document.getElementsByClassName("drop-zone"))
            // get all drop-zones' y-axis position
            // if we were using a horizontally-scrolling list, we would get the .left property
            const positions = elements.map((e) => e.getBoundingClientRect().top)
            // get the difference with the mouse's y position
            const absDifferences = positions.map((v) => Math.abs(v - mouse[1]))

            // get the item closest to the mouse
            let result = absDifferences.indexOf(Math.min(...absDifferences))

            // if the item is below the dragged item, add 1 to the index
            if (result > dragged) result += 1

            setDropZone(result)
        }
    }, [dragged, mouse])

    // drop item
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dragged !== null) {
                e.preventDefault()
                setDragged(null)

                props.setSelected((selected) => reorderList([...selected], dragged, dropZone))
            }
        }

        document.addEventListener("mouseup", handler)
        return () => document.removeEventListener("mouseup", handler)
    })

    const reorderList = <T, >(l: T[], start: number, end: number) => {
        if (start < end) return _reorderListForward([...l], start, end)
        else if (start > end) return _reorderListBackward([...l], start, end)

        return l // if start == end
    }


    const _reorderListForward = <T, >(l: T[], start: number, end: number) => {
        const temp = l[start]

        for (let i = start; i < end; i++) {
            l[i] = l[i + 1]
        }
        l[end - 1] = temp

        return l
    }

    const _reorderListBackward = <T, >(l: T[], start: number, end: number) => {
        const temp = l[start]

        for (let i = start; i > end; i--) {
            l[i] = l[i - 1]
        }

        l[end] = temp

        return l
    }

    return (
        <div id="toolbar" className="fixed bottom-0 p-[4%] flex flex-col gap-4 w-[100vw] pointer-events-none">
            <aside
                className="w-50 h-auto bg-white rounded-2xl shadow-xl outline-4 outline-black outline-solid flex flex-col pointer-events-auto gap-2 p-2"
            >
                <h1 className="text-title border-b-2 border-black">
                    Selected Events
                </h1>
                {props.selected.length > 0
                    ? <div>
                        {/* ----------FLOATING ITEM---------- */}
                        {dragged !== null && (
                            <div className="floating list-item"
                                 style={{
                                     left: `${mouse[0]}px`,
                                     top: `${mouse[1]}px`,
                                 }}
                            >{props.selected[dragged]}</div>
                        )}

                        {/* ----------MAIN LIST---------- */}
                        <ol className="list">
                            <div className={`list-item drop-zone ${
                                dragged === null || dropZone !== 0 ? "hidden" : ""
                            }`} /> {/* Drop zone before all items */}
                            {props.selected.map((value, index) => (
                                <>
                                    {dragged !== index && (
                                        <>
                                            <li
                                                key={value}
                                                className="list-item"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    setDragged(index);
                                                }}
                                            >
                                                {value}
                                            </li>
                                            <div
                                                className={`list-item drop-zone ${dragged === null || dropZone !== index + 1 ? "hidden" : ""}`}
                                            />{/* drop zone after every item */}
                                        </>
                                    )}
                                </>
                            ))}
                        </ol>
                    </div>
                    : <p className="italic text-alt text-center">
                        Tip: Click some nodes to include them in the simulation
                    </p>
                }
            </aside>
            <aside
                className="w-[100%] bg-white rounded-2xl shadow-2xl shadow-black outline-4 h-full relative outline-black outline-solid flex flex-wrap pointer-events-auto gap-2 p-2"
            >
                <SquareButton>
                    <div
                        className={props.currentlyAnimating ? "i-mdi-pause text-orange-500" : "i-mdi-play text-green-500"}/>
                </SquareButton>
                <SquareButton>
                    <div className="i-mdi-stop text-red-500"/>
                </SquareButton>
                {!props.currentlyAnimating &&
                    <>
                        <Divider orientation="vertical"/>
                        <div className="flex gap-3 justify-evenly node-drag">
                            <SquareButton onDragStart={(event) => onDragStart(event, NodeType.AND_NODE)} draggable>
                                <AndIcon/>
                            </SquareButton>
                            <SquareButton onDragStart={(event) => onDragStart(event, NodeType.OR_NODE)} draggable>
                                <img
                                    className="gate-img"
                                    src={OrSvg}
                                />
                            </SquareButton>
                            <SquareButton onDragStart={(event) => onDragStart(event, NodeType.PAND_NODE)} draggable>
                                <img
                                    className="gate-img"
                                    src={PandSvg}
                                />
                            </SquareButton>
                            <SquareButton onDragStart={(event) => onDragStart(event, NodeType.XOR_NODE)} draggable>
                                <img
                                    className="gate-img"
                                    src={XorSvg}
                                />
                            </SquareButton>
                        </div>
                    </>
                }
            </aside>
        </div>
    )
}
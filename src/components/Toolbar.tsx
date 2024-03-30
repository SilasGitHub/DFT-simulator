import React, {useEffect, useMemo, useState} from "react"
import SquareButton from "./SquareButton.tsx"
import Divider from "./Divider.tsx"
import {NodeType} from "./nodes/Nodes.ts"
import classNames from "classnames"
import OrIcon from "./node-icons/OrIcon.tsx"
import PAndIcon from "./node-icons/PAndIcon.tsx"
import XorIcon from "./node-icons/XorIcon.tsx"
import EventSvg from "../img/event.svg"
import SpareIcon from "./node-icons/SpareIcon.tsx"
import FdepIcon from "./node-icons/FdepIcon.tsx"
import AndSvg from "../img/and.svg"
import {useAnimationStore} from "../stores/useAnimationStore.tsx"

// Reorderable ids list based on this tutorial: https://dev.to/h8moss/build-a-reorderable-list-in-react-29on
export default function Toolbar() {
    const {animationState, selectedIds, setAnimationState, setSelectedIds} = useAnimationStore()

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

                setSelectedIds(reorderList([...selectedIds], dragged, dropZone))
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

    function startAnimation() {
        setAnimationState("playing");
    }

    function pauseAnimation() {
        setAnimationState("paused");
    }

    function stopAnimation() {
        setAnimationState("stopped");
    }

    const isPlayable = useMemo(() => {
        return selectedIds.length > 0
    }, [selectedIds])

    const isCurrentlyAnimating = useMemo(() => {
        return animationState !== 'stopped'
    }, [animationState])

    return (
        <div id="toolbar" className="fixed z-10 bottom-0 p-[15px] lg:p-4 xl:p-6 2xl:p-8 flex flex-col gap-4 w-[100vw] pointer-events-none">
            <aside
                className="w-52 lg:w-65 h-auto bg-background-floating rounded-2xl shadow-lg shadow-gray-500 border-4 border-theme-border flex flex-col pointer-events-auto gap-2 p-3"
            >
                <h1 className="text-title border-b-2 border-node-border">
                    Selected Events
                </h1>
                {selectedIds.length > 0
                    ? <div>
                        {/* ----------FLOATING ITEM---------- */}
                        {dragged !== null && (
                            <div className="floating list-item"
                                 style={{
                                     left: `${mouse[0]}px`,
                                     top: `${mouse[1]}px`,
                                 }}
                            >{selectedIds[dragged]}</div>
                        )}

                        {/* ----------MAIN LIST---------- */}
                        <ol className="list">
                            <div className={`list-item drop-zone ${
                                dragged === null || dropZone !== 0 ? "special-hidden" : ""
                            }`} /> {/* Drop zone before all items */}
                            {selectedIds.map((value, index) => (
                                <>
                                    {dragged !== index && (
                                        <>
                                            <li
                                                key={value}
                                                className="list-item in-list"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    setDragged(index);
                                                }}
                                            >
                                                {value}
                                            </li>
                                            <div
                                                className={`list-item drop-zone ${dragged === null || dropZone !== index + 1 ? "special-hidden" : ""}`}
                                            />{/* drop zone after every item */}
                                        </>
                                    )}
                                </>
                            ))}
                        </ol>
                    </div>
                    : <p className="italic text-alt">
                        Hint: <br/>
                        Click some events to include them in the simulation
                    </p>
                }
            </aside>
            <aside
                className={classNames(
                    'bg-background-floating rounded-2xl shadow-lg shadow-gray-500 border-4 border-theme-border h-full relative flex justify-between flex-wrap-reverse pointer-events-auto gap-x-8 gap-y-2 p-2',
                    isCurrentlyAnimating ? 'w-52 lg:w-65' : 'w-[100%]'
                )}
            >
                <div className="flex w-46 lg:w-59 justify-evenly">
                    <SquareButton
                        onClick={() => animationState === "playing" ? pauseAnimation() : startAnimation()}
                        className={isPlayable ? '' : 'disabled'}
                    >
                        <div
                            className={animationState === "playing" ? "i-mdi-pause text-pause" : "i-mdi-play text-play"}
                        />
                    </SquareButton>
                    <SquareButton onClick={() => stopAnimation()} className={isCurrentlyAnimating ? '' : 'disabled'}>
                        <div className="i-mdi-stop text-stop"/>
                    </SquareButton>
                </div>
                {!isCurrentlyAnimating &&
                    <>
                        <div className="flex flex-wrap gap-2 justify-evenly">

                            <SquareButton onDragStart={(event) => onDragStart(event, NodeType.EVENT_NODE)} draggable>
                                <img className="entity" src={EventSvg}/>
                            </SquareButton>

                            <Divider orientation="vertical"/>

                            <SquareButton onDragStart={(event) => onDragStart(event, NodeType.AND_NODE)} draggable>
                                <img className="entity gate-img" src={AndSvg}/>
                            </SquareButton>
                            <SquareButton onDragStart={(event) => onDragStart(event, NodeType.OR_NODE)} draggable>
                                <OrIcon/>
                            </SquareButton>
                            <SquareButton onDragStart={(event) => onDragStart(event, NodeType.XOR_NODE)} draggable>
                                <XorIcon/>
                            </SquareButton>

                            <Divider orientation="vertical"/>

                            <SquareButton onDragStart={(event) => onDragStart(event, NodeType.PAND_NODE)} draggable>
                                <PAndIcon/>
                            </SquareButton>
                            <SquareButton onDragStart={(event) => onDragStart(event, NodeType.FDEP_NODE)} draggable>
                                <FdepIcon className="transform scale-40 min-w-28 border-4"/>
                            </SquareButton>
                            <SquareButton onDragStart={(event) => onDragStart(event, NodeType.SPARE_NODE)} draggable>
                                <SpareIcon className="transform scale-40 min-w-28 border-4"/>
                            </SquareButton>
                        </div>
                    </>
                }
            </aside>
        </div>
    )
}
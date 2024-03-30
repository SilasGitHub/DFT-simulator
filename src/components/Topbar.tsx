import {useDiagramStateStore} from "../stores/useDiagramStateStore.ts"
import TopbarButton from "./TopbarButton.tsx"
import React, {useCallback} from "react"
import {ReactFlowInstance, useReactFlow} from "reactflow"
import {downloadFile} from "../utils/downloadFile.ts"
import TopbarSpeedChanger from "./TopbarSpeedChanger.tsx"

type TopBarProps = {
    reactFlowInstance: ReactFlowInstance | null
}

// Reorderable ids list based on this tutorial: https://dev.to/h8moss/build-a-reorderable-list-in-react-29on
export default function Topbar({reactFlowInstance}: TopBarProps) {
    const {animationState, clearDiagram, toJson, loadJson} = useDiagramStateStore()
    const {setViewport} = useReactFlow()
    const loadDiagramInput = React.useRef<HTMLInputElement>(null)

    const onFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = () => {
            const json = reader.result as string
            loadJson(json, setViewport)
        }
        reader.readAsText(file)
    }, [loadJson, setViewport])

    const restoreDiagram = useCallback(() => {
        if (!loadDiagramInput.current) return
        loadDiagramInput.current.click()
    }, [loadDiagramInput])

    const saveDiagram = useCallback(() => {
        if (!reactFlowInstance) return

        const json = toJson(reactFlowInstance)
        downloadFile(json, `dfa-${new Date().toLocaleString().replace(", ", "-")}.dfts`, "application/json")
    }, [reactFlowInstance, toJson])

    return (
        <div id="topbar"
             className="flex items-center justify-between h-10 w-full bg-background-floating border-b-4 border-theme-border text-main"
        >
            {animationState === "stopped"
                ? <>
                    <div className="flex h-full">
                        <input
                            ref={loadDiagramInput}
                            onChange={onFileChange}
                            type="file"
                            accept=".dfts"
                            className="hidden"
                        />

                        <TopbarButton
                            onClick={restoreDiagram}
                        >
                            <div className="i-mdi-upload text-main"/>
                        </TopbarButton>
                        <TopbarButton
                            onClick={saveDiagram}
                        >
                            <div className="i-mdi-content-save text-main"/>
                        </TopbarButton>
                        <TopbarButton
                            onClick={clearDiagram}
                        >
                            <div className="i-mdi-delete text-stop"/>
                        </TopbarButton>
                    </div>
                </>
                : <div className="ml-4">
                    Animation is running...
                </div>
            }
            <div className="flex h-full">
                <TopbarSpeedChanger/>
            </div>
        </div>
    )
}
import {useDiagramStateStore} from "../stores/useDiagramStateStore.ts"
import TopbarButton from "./TopbarButton.tsx"

// Reorderable ids list based on this tutorial: https://dev.to/h8moss/build-a-reorderable-list-in-react-29on
export default function Topbar() {
    const {animationState, clearDiagram} = useDiagramStateStore()


    return (
        <div id="topbar" className="h-10 w-full bg-background-floating border-b-4 border-theme-border">
            {animationState === "stopped"
                ? <>
                    <TopbarButton
                        className=""
                        onClick={clearDiagram}
                    >
                        <div className="i-mdi-delete text-stop"/>
                    </TopbarButton>
                </>
                : <>
                    Animation is running
                </>
            }
        </div>
    )
}
import FlowDisplay from "./components/FlowDisplay"
import "./css/main.scss"
import "./css/entities.scss"
import "virtual:uno.css"
import "@unocss/reset/tailwind.css"
import {ReactFlowProvider} from "reactflow"
import Topbar from "./components/Topbar.tsx"

export default function App() {
    return (
        <div className="w-[100vw] h-[100vh] relative">
            <ReactFlowProvider>
                <Topbar/>
                <FlowDisplay/>
            </ReactFlowProvider>
        </div>
    )
}
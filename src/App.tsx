import { useState } from "react";
import FlowDisplay from "./components/FlowDisplay";
import './css/main.scss';
import './css/entities.scss';
import 'virtual:uno.css';
import '@unocss/reset/tailwind.css'
import {ReactFlowProvider} from "reactflow"

export type AnimationState = "stopped" | "playing" | "paused";

export default function App() {
	const [selectedIds, setSelectedIds] = useState(new Array<string>());
	const [animationState, setCurrentlyAnimating] = useState("stopped" as AnimationState);

	return (
		<div className="w-[100vw] h-[100vh] relative">
			<ReactFlowProvider>
				<FlowDisplay
					animationState={animationState}
					setAnimationState={setCurrentlyAnimating}
					selectedIds={selectedIds}
					setSelectedIds={setSelectedIds}
				/>
			</ReactFlowProvider>
		</div>
	);
}
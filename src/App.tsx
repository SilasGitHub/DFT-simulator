import { useState } from "react";
import FlowDisplay from "./components/FlowDisplay";
import NewToolbar from "./components/NewToolbar";
import './css/main.scss';
import './css/entities.scss';
import 'virtual:uno.css';
import '@unocss/reset/tailwind.css'
import {ReactFlowProvider} from "reactflow"

export default function App() {
	const [selected, setSelected] = useState(new Array<string>());
	const [currentlyAnimating, setCurrentlyAnimating] = useState(false);

	return (
		<div className="w-[100vw] h-[100vh] relative">
			<ReactFlowProvider>
				<FlowDisplay
					currentlyAnimating={currentlyAnimating}
					selected={selected}
					setSelected={setSelected}
				/>
			</ReactFlowProvider>
			<NewToolbar
				currentlyAnimating={currentlyAnimating}
				setCurrentlyAnimating={setCurrentlyAnimating}
				selected={selected}
				setSelected={setSelected}
			/>
		</div>
	);
}
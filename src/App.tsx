import { useState } from "react";
import FlowDisplay from "./components/FlowDisplay";
import Toolbar from "./components/Toolbar";
import './css/main.css'

export default function App() {
	const [selected, setSelected] = useState(new Array<string>()); 
	const [currentlyAnimating, setCurrentlyAnimating] = useState(false);

	return (
	<div style={{ width: '100vw', height: '100vh', display: "flex"}}>
		<div>
			<Toolbar currentlyAnimating={currentlyAnimating} setCurrentlyAnimating={setCurrentlyAnimating} selected={selected} setSelected={setSelected}/>
		</div>
		{/* <div> */}
			<FlowDisplay currentlyAnimating={currentlyAnimating} selected={selected} setSelected={setSelected}/>
		{/* </div> */}
    </div>
	);
}
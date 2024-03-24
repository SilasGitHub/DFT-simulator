import { useState } from "react";
import FlowDisplay from "./components/FlowDisplay";
import Toolbar from "./components/Toolbar";
import './css/main.css'

export default function App() {
	const [selected, setSelected] = useState(["hi", "bye", "try", "sky"]); 

	return (
	<div style={{ width: '100vw', height: '100vh', display: "flex"}}>
		<div>
			<Toolbar selected={selected} setSelected={setSelected}/>	
		</div>
		{/* <div> */}
			<FlowDisplay selected={selected} setSelected={setSelected}/>
		{/* </div> */}
    </div>
	);
}
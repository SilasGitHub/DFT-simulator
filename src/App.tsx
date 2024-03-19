import FlowDisplay from "./components/FlowDisplay";
import Toolbar from "./components/Toolbar";
import './css/main.css'

export default function App() {
	return (
	<div style={{ width: '100vw', height: '100vh', display: "flex"}}>
		<div>
			<Toolbar/>	
		</div>
		{/* <div> */}
			<FlowDisplay />
		{/* </div> */}
	</div>
	);
}
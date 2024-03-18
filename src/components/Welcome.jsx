import Dawid from "../img/daw.jpg"
import "../css/main.css"

export default function Welcome() {
	return (
	<>
	<div className="wrapper">
		<h1>Hello World</h1>	
		<img src={Dawid} alt="Dawid Image" width={200} height={200} />
	</div>
	</>
	);
	}
	
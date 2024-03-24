import React, { useEffect, useState } from 'react'

interface ToolbarProps {
    selected : Array<string>,
	setSelected :  React.Dispatch<React.SetStateAction<string[]>>
}

export default function Toolbar(props : ToolbarProps) {
	const [dragged, setDragged] = useState<number | null>(null);
	const [mouse, setMouse] = useState<[number, number]>([0, 0]);
	const [dropZone, setDropZone] = useState(0);
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
      };

	// get mouse coordenates
    useEffect(() => {
    	const handler = (e: MouseEvent) => {
      		setMouse([e.x, e.y]);
		};

		document.addEventListener("mousemove", handler);

		return () => document.removeEventListener("mousemove", handler);
	  }, []);

	    // get closest drop zone
	useEffect(() => {
		if (dragged !== null) {
		// get all drop-zones
		const elements = Array.from(document.getElementsByClassName("drop-zone"));
		// get all drop-zones' y-axis position
		// if we were using a horizontally-scrolling list, we would get the .left property
		const positions = elements.map((e) => e.getBoundingClientRect().top);
		// get the difference with the mouse's y position
		const absDifferences = positions.map((v) => Math.abs(v - mouse[1]));

		// get the item closest to the mouse
		let result = absDifferences.indexOf(Math.min(...absDifferences));

		// if the item is below the dragged item, add 1 to the index
		if (result > dragged) result += 1;

		setDropZone(result);
		}
	}, [dragged, mouse]);

	// drop item
	useEffect(() => {
		const handler = (e: MouseEvent) => {
		if (dragged !== null) {
			e.preventDefault();
			setDragged(null);

			props.setSelected((selected) => reorderList([...selected], dragged, dropZone));
		}
		};

		document.addEventListener("mouseup", handler);
		return () => document.removeEventListener("mouseup", handler);
	});

	const reorderList = <T,>(l: T[], start: number, end: number) => {
		if (start < end) return _reorderListForward([...l], start, end);
		else if (start > end) return _reorderListBackward([...l], start, end);
	  
		return l; // if start == end
	  };
	  

	const _reorderListForward = <T,>(l: T[], start: number, end: number) => {
		const temp = l[start];

		for (let i=start; i<end; i++) {
		l[i] = l[i+1];
		}
		l[end - 1] = temp;

		return l;
	};

	const _reorderListBackward = <T,>(l: T[], start: number, end: number) => {
		const temp = l[start];
	  
		for (let i = start; i > end; i--) {
		  l[i] = l[i - 1];
		}
	  
		l[end] = temp;
	  
		return l;
	  };	  
	  
	return (
	<div className='toolbarWrapper'>
		<div>
			Drag & drop nodes
			<aside className="node-drag">
				<div className="dndnode" onDragStart={(event) => onDragStart(event, 'eventNode')} draggable>
					Fail Event
				</div>
				<div className="dndnode" onDragStart={(event) => onDragStart(event, 'andNode')} draggable>
					AND
				</div>
				<div className="dndnode" onDragStart={(event) => onDragStart(event, 'pandNode')} draggable>
					PAND
				</div>
				<div className="dndnode" onDragStart={(event) => onDragStart(event, 'orNode')} draggable>
					OR
				</div>
				<div className="dndnode" onDragStart={(event) => onDragStart(event, 'xorNode')} draggable>
					XOR
				</div>
				<div className="dndnode" onDragStart={(event) => onDragStart(event, 'fdep')} draggable>
					FDEP
				</div>
				<div className="dndnode" onDragStart={(event) => onDragStart(event, 'spareNode')} draggable>
					SPARE
				</div>
			</aside>
		</div>
		<div>
			Selected Ids
			<aside>
				{/* ----------FLOATING ITEM---------- */}
				{dragged !== null && (
					<div className="floating list-item"
					style={{
					left: `${mouse[0]}px`,
					top: `${mouse[1]}px`,
					}}
					>{props.selected[dragged]}</div>
				)}

				{/* ----------MAIN LIST---------- */}
				<ol className="list">
				<div className={`list-item drop-zone ${
						dragged === null || dropZone !== 0 ? "hidden" : ""
					}`} /> {/* Drop zone before all items */}
				{props.selected.map((value, index) => (
					<>
					{dragged !== index && (
						<>
						<li
							key={value}
							className="list-item"
							onMouseDown={(e) => {
							e.preventDefault();
							setDragged(index);
							}}
						>
							{value}
						</li>
						<div
							className={`list-item drop-zone ${dragged === null || dropZone !== index + 1 ? "hidden" : ""}`}
						/>{/* drop zone after every item */}
						</>
					)}
					</>
				))}
				</ol>
			</aside>
		</div>
	</div>
	);
}
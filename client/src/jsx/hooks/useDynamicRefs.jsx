import useDynamicRefs from "./useDynamicRefs"; // Import the custom hook

import { useRef } from "react";

function useDynamicRefs() {
	const refs = useRef(new Map());

	function setRef(id, ref) {
		const map = refs.current;
		if (ref) {
			map.set(id, ref);
		} else {
			map.delete(id);
		}
	}

	function getRef(id) {
		return refs.current.get(id);
	}

	return { setRef, getRef };
}

export default useDynamicRefs;

/* function MyComponent({ catList }) {
	const { setRef, getRef } = useDynamicRefs();

	useEffect(() => {
		// Example: Scroll to a particular node after mounting
		const node = getRef(5);
		if (node) {
			node.scrollIntoView({ behavior: "smooth" });
		}
	}, [getRef]);

	return (
		<ul>
			{catList.map((cat) => (
				<li
					key={cat.id}
					ref={(node) => setRef(cat.id, node)} // Set the ref using the custom hook
				>
					<img src={cat.imageUrl} alt={"Cat #" + cat.id} />
				</li>
			))}
		</ul>
	);
} */

/* example */

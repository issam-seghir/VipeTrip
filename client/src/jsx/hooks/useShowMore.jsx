import { useState } from "react";

// Custom hook for handling show more functionality
export const useShowMore = (text, initialLength) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const shortText = text.slice(0, Math.max(0, initialLength));

	const toggleShowMore = () => {
		setIsExpanded(!isExpanded);
	};

	return {
		displayedText: isExpanded ? text : shortText,
		isTextLong: text.length > initialLength,
		toggleShowMore,
	};
};

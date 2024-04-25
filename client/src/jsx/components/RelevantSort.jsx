import { useConnector } from "react-instantsearch";
import connectRelevantSort from "instantsearch.js/es/connectors/relevant-sort/connectRelevantSort";

export function useRelevantSort(props) {
	return useConnector(connectRelevantSort, props);
}


export function RelevantSort({ textComponent: TextComponent, buttonTextComponent: ButtonTextComponent, ...props }) {
	const { isRelevantSorted, refine } = useRelevantSort(props);
	const relevancyStrictness = isRelevantSorted ? 0 : undefined;

	return (
		<div>
			<TextComponent isRelevantSorted={isRelevantSorted} />
			<button type="button" onClick={() => refine(relevancyStrictness)}>
				<ButtonTextComponent isRelevantSorted={isRelevantSorted} />
			</button>
		</div>
	);
}

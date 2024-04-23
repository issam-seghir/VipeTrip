import { useQueryRules } from "react-instantsearch-core";

export function QueryRuleContext(props) {
	useQueryRules(props);
	return null;
}

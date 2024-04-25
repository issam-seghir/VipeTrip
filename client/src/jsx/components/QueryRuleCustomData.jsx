import { classNames } from "primereact/utils";
import { useQueryRules } from "react-instantsearch-core";

export function QueryRuleCustomData(props) {
	const { items } = useQueryRules(props);
	return <div className={classNames("ais-QueryRuleCustomData", props.className)}>{props.children({ items })}</div>;
}

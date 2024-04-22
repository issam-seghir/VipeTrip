import algoliasearch from "algoliasearch/lite";
import {
	InstantSearch,
	RefinementList,
	SearchBox,
	Hits,
	Highlight,
	useConnector,
	Pagination,
	Configure,
	
} from "react-instantsearch";
import { InputText } from "primereact/inputtext";

const searchClient = algoliasearch("O4DXFFDB42", "5d3fddae61b450463dba4617827c8cc8");

function Hit({hit}) {
    return (
		<div>
			<img src={hit.image} alt={hit.name} />
			<div>{hit.firstName}</div>
			<div>{hit.lastName}</div>
			<div>{hit.email}</div>
			<h1>
				<Highlight attribute="name" hit={hit} />
			</h1>
			{/* Add more fields as necessary */}
		</div>
	);
}
// const CustomSearchBox = ({ currentRefinement, refine }) => (
// 	<InputText value={currentRefinement} onChange={(event) => refine(event.target.value)} placeholder="Search..." />
// );
// const ConnectedSearchBox = connectSearchBox(CustomSearchBox);

export function AlgoliaSearchBar() {
	return (
		<InstantSearch searchClient={searchClient} indexName="dev_vipetrip" insights>
			<Configure hitsPerPage={40} />
			<RefinementList attribute="firstName" />
			<SearchBox />
			<Hits hitComponent={Hit} />
			<Pagination />
		</InstantSearch>
	);
}

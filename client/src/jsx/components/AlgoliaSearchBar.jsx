import algoliasearch from "algoliasearch/lite";
import {
	Configure,
	Highlight,
	Hits,
	InstantSearch,
	Pagination,
	RefinementList,
	SearchBox,
	Snippet,
	SortBy,
	PoweredBy,
	HitsPerPage,
	ClearRefinements,
	CurrentRefinements,
} from "react-instantsearch";
import { Panel } from "./Panel";
import { RefrechAlgolia } from "./RefrechAlgolia";
import { QueryRuleContext } from "./QueryRuleContext";

const searchClient = algoliasearch(import.meta.env.VITE_ALGOLIA_APP_ID, import.meta.env.VITE_ALOGOLIA_SEARCH_API);
const index = searchClient.initIndex(import.meta.env.VITE_ALGOLIA_INDEX_NAME);

function Hit({ hit }) {
	return (
		<div className="border-100 border-round-lg">
			<Snippet hit={hit} attribute="firstName" />
			<img
				src={hit.picturePath}
				alt={hit.name}
				height={"40px"}
				width={"40px"}
				className="border-100 border-round-lg"
			/>
			<Highlight attribute="firstName" hit={hit} className="bg-blue-500" />
			<div>{hit.lastName}</div>
			<div>job :{hit.job}</div>
			<hr className="" />
			<div>from : {hit.location}</div>
			<div>totalPosts : {hit.totalPosts}</div>
			<div>viewedProfile : {hit.viewedProfile}</div>
			<div>impressions : {hit.impressions}</div>
			{/* Add more fields as necessary */}
		</div>
	);
}

export function AlgoliaSearchBar() {
	return (
		<InstantSearch
			searchClient={searchClient}
			indexName={import.meta.env.VITE_ALGOLIA_INDEX_NAME}
			routing={true}
			insights={true}
		>
			<Configure hitsPerPage={5} />
			{/* filter section  */}
			<Panel header="location">
				<RefinementList
					attribute="location"
					sortBy={["name:asc"]}
					searchable={true}
					searchablePlaceholder="Search brands"
					showMore={true}
				/>
				{/* filterOnly filter will not display any thing in UI  */}
				<RefinementList attribute="job" />
			</Panel>

			<div className="Search">
				<SearchBox
					autofocus={true}
					placeholder="Search for users/posts"
					translations={{
						submitButtonTitle: "Envoyer",
					}}
				/>
				<div className="Search-header">
					<PoweredBy />
					<HitsPerPage
						items={[
							{ label: "10 hits per page", value: 10, default: true },
							{ label: "20 hits per page", value: 20 },
						]}
					/>
					{/* create two replicate  "dev_vipetrip_totalPosts_asc" & "dev_vipetrip_totalPosts_desc" in "dev_vipetrip" index*/}
					{/* in "ranking and sorting" config for each one of the replacte add "sortingBy attribute" as "totalPosts" with "asc" or "desc" */}
					<SortBy
						defaultRefinement="dev_vipetrip"
						items={[
							{ value: "dev_vipetrip", label: "Sort by Total Posts" },
							{ value: "dev_vipetrip_totalPosts_asc", label: "Total Posts (asc)" },
							{ value: "dev_vipetrip_totalPosts_desc", label: "Total Posts (desc)" },
						]}
					/>
					<SortBy
						defaultRefinement="dev_vipetrip"
						items={[
							{ value: "dev_vipetrip", label: "Sort by Impressions" },
							{ value: "dev_vipetrip_impressions_desc", label: "Most Impressions" },
							{ value: "dev_vipetrip_impressions_asc", label: "Less Impressions" },
						]}
					/>

					<RefrechAlgolia />
				</div>
				<div className="CurrentRefinements">
					<ClearRefinements />
					<CurrentRefinements
						transformItems={(items) =>
							items.map((item) => {
								const label = item.label.startsWith("hierarchicalCategories")
									? "Hierarchy"
									: item.label;

								return {
									...item,
									attribute: label,
								};
							})
						}
					/>
				</div>

				<QueryRuleContext
					trackedFilters={{
						location: () => ["Algeria"],
					}}
				/>

				{/* <QueryRuleCustomData>
					{({ items }) => (
						<>
							{items.map((item) => (
								<a href={item.link} key={item.banner}>
									<img src={item.banner} alt={item.title} />
								</a>
							))}
						</>
					)}
				</QueryRuleCustomData> */}
			</div>
			<Hits hitComponent={Hit} />
			<Pagination />
		</InstantSearch>
	);
}

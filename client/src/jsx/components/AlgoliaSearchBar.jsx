import { RelevantSort } from "@jsx/components/RelevantSort";
import algoliasearch from "algoliasearch/lite";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { TabPanel, TabView } from "primereact/tabview";
import { classNames } from "primereact/utils";
import { useState } from "react";
import {
	ClearRefinements,
	Configure,
	CurrentRefinements,
	Highlight,
	Hits,
	HitsPerPage,
	InfiniteHits,
	InstantSearch,
	Pagination,
	PoweredBy,
	RefinementList,
	SearchBox,
	SortBy,
	Index,
	Stats,
} from "react-instantsearch";
import { Panel } from "./Panel";
import { RefrechAlgolia } from "./RefrechAlgolia";

const searchClient = algoliasearch(import.meta.env.VITE_ALGOLIA_APP_ID, import.meta.env.VITE_ALOGOLIA_SEARCH_API);
const index = searchClient.initIndex(import.meta.env.VITE_ALGOLIA_INDEX_NAME);

function UsersHit({ hit }) {
	return (
		<div className="col-12" key={hit._id}>
			<div
				className={classNames("flex flex-column xl:flex-row xl:align-items-start p-4 gap-4", {
					"border-top-1 surface-border": hit.__position !== 0,
				})}
			>
				<img
					className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
					src={hit.picturePath}
					alt={hit.name}
				/>
				<div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
					<div className="flex flex-column align-items-center sm:align-items-start gap-3">
						<Highlight attribute="firstName" hit={hit} className="text-md bg-blue-400 font-bold text-900" />
						{/* <Snippet hit={hit} attribute="description" /> */}
						<div>{hit.lastName}</div>
						<div>job :{hit.job}</div>
						<div className="flex flex-column align-items-center gap-3">
							<span className="flex align-items-center gap-2">
								<i className="pi pi-tag"></i>
								<span className="font-semibold">{hit.location}</span>
							</span>
							<div>totalPosts : {hit.totalPosts}</div>
							<div>totalComments : {hit.viewedProfile}</div>
							<div>impressions : {hit.impressions}</div>
						</div>
					</div>

					<Button
						className="p-button-rounded"
						// disabled={product.inventoryStatus === "OUTOFSTOCK"}
					>
						Add Friend
					</Button>
				</div>
			</div>
		</div>
	);
}
function PostsHit({ hit }) {
	return (
		<div className="col-12" key={hit._id}>
			<div
				className={classNames("flex flex-column xl:flex-row xl:align-items-start p-4 gap-4", {
					"border-top-1 surface-border": hit.__position !== 0,
				})}
			>
				<img
					className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
					src={hit.picturePath}
					alt={hit.name}
				/>
				<div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
					<div className="flex flex-column align-items-center sm:align-items-start gap-3">
						<Highlight
							attribute="userId.fullName"
							hit={hit}
							className="text-md bg-blue-400 font-bold text-900"
						/>
						{/* <Snippet hit={hit} attribute="description" /> */}
						<div>{hit.description}</div>
						<div>{hit.edited ? "🔁" : "✔"}</div>
						<div className="flex flex-column align-items-center gap-3">
							<span className="flex align-items-center gap-2">
								<i className="pi pi-tag"></i>
								<span className="font-semibold">{hit.userId.fullName}</span>
							</span>
							<div>totalLikes : {hit.totalLikes}</div>
							<div>totalComments : {hit.totalComments}</div>
							<div>totalShares : {hit.totalShares}</div>
						</div>
					</div>

					<Button
						className="p-button-rounded"
						// disabled={product.inventoryStatus === "OUTOFSTOCK"}
					>
						Show Post
					</Button>
				</div>
			</div>
		</div>
	);
}
const TextComponent = ({ isRelevantSorted }) => (
	<p>
		{isRelevantSorted
			? "We removed some search results to show you the most relevant ones"
			: "Currently showing all results"}
	</p>
);

const ButtonTextComponent = ({ isRelevantSorted }) => (
	<span>{isRelevantSorted ? "See all results" : "See relevant results"}</span>
);

export function AlgoliaSearchBar() {
	const [checked, setChecked] = useState(false);
	const [activeIndex, setActiveIndex] = useState(0);
	const usersTab = activeIndex === 0;
	return (
		<InstantSearch searchClient={searchClient} indexName={"users"} routing={true} insights={true}>
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
			<Index indexName="users">
				{usersTab && (
					<div className="Search">
						<SearchBox
							autofocus={true}
							placeholder="Search for users"
							translations={{
								submitButtonTitle: "Envoyer",
							}}
						/>
						<div className="Search-header">
							<PoweredBy />
							<div className="flex align-items-center">
								<Checkbox
									inputId="infinteScrolling"
									name="infinteScrolling"
									onChange={(e) => setChecked(e.checked)}
									checked={checked}
								/>

								<label htmlFor="infinteScrolling" className="ml-2">
									Infinte Scrolling
								</label>
							</div>
							<HitsPerPage
								items={[
									{ label: "10 hits per page", value: 10, default: true },
									{ label: "20 hits per page", value: 20 },
								]}
								hidden={checked}
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
									{ value: "dev_vipetrip", label: "Relevent Impressions" },
									{
										value: "dev_vipetrip_impressions_desc",
										label: "Relevent Sort : Most Impressions",
									},
									{
										value: "dev_vipetrip_impressions_asc",
										label: "Relevent Sort : Less Impressions",
									},
								]}
							/>
							<RelevantSort textComponent={TextComponent} buttonTextComponent={ButtonTextComponent} />
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

						<TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
							<TabPanel header="Users">
								<Stats
									translations={{
										stats(nbHits, timeSpentMs) {
											return `${nbHits} results found in ${timeSpentMs}ms`;
										},
									}}
								/>
								{checked ? (
									<InfiniteHits showPrevious hitComponent={UsersHit} />
								) : (
									<>
										<Hits hitComponent={UsersHit} />
										<Pagination />
									</>
								)}
							</TabPanel>
							<TabPanel header="Posts">
								<Stats
									translations={{
										stats(nbHits, timeSpentMs) {
											return `${nbHits} results found in ${timeSpentMs}ms`;
										},
									}}
								/>
								{checked ? (
									<InfiniteHits showPrevious hitComponent={UsersHit} />
								) : (
									<>
										<Hits hitComponent={PostsHit} />
										<Pagination />
									</>
								)}
							</TabPanel>
						</TabView>
					</div>
				)}
			</Index>
			<Index indexName="posts">
				{!usersTab && (
					<div className="Search">
						<SearchBox
							autofocus={true}
							placeholder="Search for posts"
							translations={{
								submitButtonTitle: "Envoyer",
							}}
						/>
						<div className="Search-header">
							<PoweredBy />
							<div className="flex align-items-center">
								<Checkbox
									inputId="infinteScrolling"
									name="infinteScrolling"
									onChange={(e) => setChecked(e.checked)}
									checked={checked}
								/>

								<label htmlFor="infinteScrolling" className="ml-2">
									Infinte Scrolling
								</label>
							</div>
							<HitsPerPage
								items={[
									{ label: "10 hits per page", value: 10, default: true },
									{ label: "20 hits per page", value: 20 },
								]}
								hidden={checked}
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
									{ value: "dev_vipetrip", label: "Relevent Impressions" },
									{
										value: "dev_vipetrip_impressions_desc",
										label: "Relevent Sort : Most Impressions",
									},
									{
										value: "dev_vipetrip_impressions_asc",
										label: "Relevent Sort : Less Impressions",
									},
								]}
							/>
							<RelevantSort textComponent={TextComponent} buttonTextComponent={ButtonTextComponent} />
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

						<TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
							<TabPanel header="Users">
								<Stats
									translations={{
										stats(nbHits, timeSpentMs) {
											return `${nbHits} results found in ${timeSpentMs}ms`;
										},
									}}
								/>
								{checked ? (
									<InfiniteHits showPrevious hitComponent={UsersHit} />
								) : (
									<>
										<Hits hitComponent={UsersHit} />
										<Pagination />
									</>
								)}
							</TabPanel>
							<TabPanel header="Posts">
								<Stats
									translations={{
										stats(nbHits, timeSpentMs) {
											return `${nbHits} results found in ${timeSpentMs}ms`;
										},
									}}
								/>
								{checked ? (
									<InfiniteHits showPrevious hitComponent={UsersHit} />
								) : (
									<>
										<Hits hitComponent={PostsHit} />
										<Pagination />
									</>
								)}
							</TabPanel>
						</TabView>
					</div>
				)}
			</Index>
		</InstantSearch>
	);
}

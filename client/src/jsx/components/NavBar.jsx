import { getAlgoliaResults } from "@algolia/autocomplete-js";
import { createQuerySuggestionsPlugin } from "@algolia/autocomplete-plugin-query-suggestions";
import { createLocalStorageRecentSearchesPlugin } from "@algolia/autocomplete-plugin-recent-searches";
import Logo from "@svg/logo.svg?react";
import algoliasearch from "algoliasearch";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React, { Fragment, useRef } from "react";
import { AlgoliaAutocomplete } from "./AlgoliaAutoComplete";
import { useNavigate } from "react-router-dom";

// const searchClient = algoliasearch(import.meta.env.VITE_ALGOLIA_APP_ID, import.meta.env.VITE_ALOGOLIA_SEARCH_API);
const appId = "latency";import { Button } from "primereact/button";

const apiKey = "6be0576ff61c053d5f9a3225e2a90f76";
const searchClient = algoliasearch(appId, apiKey);

const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
	key: "qs-with-rs-example",
	limit: 5,
	transformSource({ source }) {
		return {
			...source,
			templates: {
				...source.templates,
				header({ state }) {
					if (state.query) {
						return null;
					}

					return (
						<Fragment>
							<span className="aa-SourceHeaderTitle">Your searches</span>
							<div className="aa-SourceHeaderLine" />
						</Fragment>
					);
				},
			},
		};
	},
});

const querySuggestionsPlugin = createQuerySuggestionsPlugin({
	searchClient,
	indexName: "instant_search_demo_query_suggestions",
	getSearchParams() {
		return recentSearchesPlugin.data.getAlgoliaSearchParams({
			hitsPerPage: 5,
		});
	},
	transformSource({ source }) {
		return {
			...source,
			templates: {
				...source.templates,
				header({ state }) {
					if (state.query) {
						return null;
					}

					return (
						<Fragment>
							<span className="aa-SourceHeaderTitle">Popular searches</span>
							<div className="aa-SourceHeaderLine" />
						</Fragment>
					);
				},
			},
		};
	},
});

export function ProductItem({ hit, components }) {

	return (
		<a href={hit.url} className="aa-ItemLink">
			<div className="aa-ItemContent">
				<div className="aa-ItemTitle">
					<components.Highlight hit={hit} attribute="name" />
				</div>
			</div>
		</a>
	);
}

export default function CustomDemo() {
	const menuLeft = useRef(null);
	const toast = useRef(null);
	const navigate = useNavigate();
	const items = [
		{
			label: "Options",
			items: [
				{
					label: "Settings",
					icon: "pi pi-cog",
					command: () => {
						toast.current.show({
							severity: "success",
							summary: "Success",
							detail: "File created",
							life: 3000,
						});
					},
				},
				{
					label: "Logout",
					icon: "pi pi-sign-out",
					command: () => {
						toast.current.show({
							severity: "success",
							summary: "Success",
							detail: "File created",
							life: 3000,
						});
					},
				},
			],
		},
	];

	const startContent = (
		<React.Fragment>
			<Logo />
		</React.Fragment>
	);

	const centerContent = (
		<div className="flex flex-wrap align-items-center gap-3">
			<AlgoliaAutocomplete
				placeholder="Search for products"
				detachedMediaQuery="(max-width: 1024px)"
				openOnFocus={true}
				// icon={<i className="pi pi-search"></i>}
				classNames={{
					// form: "relative rounded-md shadow-sm flex-1",
					// inputWrapperPrefix: "absolute inset-y-0 left-0 flex items-center pl-3",
					// inputWrapperSuffix: "absolute inset-y-0 right-0 flex items-center pr-2",
					// label: "flex items-center",
					// submitButton: "h-5 w-5 text-gray-400",
					// clearButton: "h-5 w-5 text-gray-400",
					input: "p-autocomplete block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
					panel: "flex-1 lg:flex-none lg:absolute lg:mt-2 lg:py-1 z-10 lg:ring-1 lg:ring-black lg:ring-opacity-5 lg:text-sm text-gray-500 bg-white lg:shadow-lg lg:rounded-md overflow-y-scroll lg:max-h-96",
					// detachedSearchButton: "p-2 text-gray-400 hover:text-gray-500",
					detachedSearchButtonPlaceholder: "sr-only",
					detachedContainer: "fixed inset-0 flex flex-col divide-y divide-gray-200/50",
					detachedFormContainer: "flex p-2 bg-white",
					detachedCancelButton: "bg-white px-2 ml-2 text-gray-500 hover:text-gray-600 transition-colors",
				}}
				className="lg:w-30rem"
				getSources={({ query }) => [
					{
						sourceId: "products",
						getItems() {
							return getAlgoliaResults({
								searchClient,
								queries: [
									{
										indexName: "instant_search",
										query,
									},
								],
							});
						},
						templates: {
							item({ item, components }) {
								return <ProductItem hit={item} components={components} />;
							},
						},
					},
				]}
				navigator={{
					navigate({ itemUrl }) {
						navigate(itemUrl);
					},
				}}
				onSubmit={({ state }) => {
					navigate(`/search/?query=${state.query}`);
				}}
				plugins={[recentSearchesPlugin, querySuggestionsPlugin]}
			/>
		</div>
	);

	const endContent = (
		<React.Fragment>
			<Button raised={true} outlined rounded icon={"pi pi-moon"} />
			<div className="card flex justify-content-center">
				<Toast ref={toast}></Toast>
				<Menu model={items} popup ref={menuLeft} id="popup_menu_left" />
				<div className="flex align-items-center gap-2">
					<Avatar
						aria-controls="popup_menu_left"
						aria-haspopup
						onClick={(event) => menuLeft.current.toggle(event)}
						image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
						shape="circle"
					/>
					<span className="font-bold text-bluegray-50">Amy Elsner</span>
				</div>
			</div>
		</React.Fragment>
	);

	return (
		<div className="card">
			<Toolbar
				start={startContent}
				center={centerContent}
				end={endContent}
				className="surface-card px-8 border-top-none border-x-none"
				style={{
					borderRadius: "0rem",
				}}
			/>
		</div>
	);
}

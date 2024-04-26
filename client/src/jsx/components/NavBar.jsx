import Logo from "@svg/logo.svg?react";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React, { useRef } from "react";
import { AlgoliaAutocomplete } from "./AlgoliaAutoComplete";
import { getAlgoliaResults } from "@algolia/autocomplete-js";
import algoliasearch from "algoliasearch";

const appId = "latency";
const apiKey = "6be0576ff61c053d5f9a3225e2a90f76";
const searchClient = algoliasearch(appId, apiKey);

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
				openOnFocus={true}
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
			/>
		</div>
	);

	const endContent = (
		<React.Fragment>
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
				className="bg-gray-900 px-8 shadow-2"
				style={{
					borderRadius: "0rem",
					backgroundImage: "linear-gradient(to right, var(--bluegray-500), var(--bluegray-800))",
				}}
			/>
		</div>
	);
}

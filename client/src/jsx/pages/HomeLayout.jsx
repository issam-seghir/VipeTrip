import Navbar from "@components/NavBar";
import { useMediaQuery } from "@mui/material";
import { Badge } from "primereact/badge";
import { Menu } from "primereact/menu";
import { Suspense } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { classNames } from "primereact/utils";

export const HomeLayout = () => {
    const isActive = (url) => window.location.pathname === url;

	const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
	const navigate = useNavigate();
	const itemRenderer = (item) => (
		<div className="p-menuitem-content border-round-xl w-full mb-2">
			<NavLink
				to={item.url}
				className="flex align-items-center border-round-xl p-menuitem-link w-full"
				style={({ isActive, isPending, isTransitioning }) => {
					return {
						fontWeight: isActive ? "bold" : "revert-layer",
						// color: isActive ? "red" : "revert-layer",
						// background: isActive ? "red" : "revert-layer",
						viewTransitionName: isTransitioning ? "slide" : "revert-layer",
					};
				}}
			>
				<span className={item.icon} />
				<span className="mx-3">{item.label}</span>
				{item.badge && <Badge className="ml-auto" value={item.badge} />}
				{item.shortcut && (
					<span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
						{item.shortcut}
					</span>
				)}
			</NavLink>
		</div>
	);
	const items = [
		{
			label: "Home",
			icon: "pi pi-home",
			url: "/home",
			className: classNames({ "p-focus": isActive("/home") }),
			template: itemRenderer,
		},
		{
			label: "Explore",
			icon: "pi pi-compass",
			url: "/explore",
			template: itemRenderer,
			// command: () => {
			// 	navigate("/installation");
			// },
		},
		{
			label: "Notifications",
			icon: "pi pi-bell",
			url: "notifications",
			template: itemRenderer,
		},
		{
			label: "Messages",
			icon: "pi pi-envelope",
			badge: 2,
			url: "messages",
			template: itemRenderer,
		},
		{
			label: "Bookmarkes",
			icon: "pi pi-bookmark",
			url: "bookmarkes",
			template: itemRenderer,
		},
		{
			label: "Profile",
			icon: "pi pi-user",
			url: "profile",
			template: itemRenderer,
		},
		{
			label: "Settings",
			icon: "pi pi-cog",
			url: "settings",
			template: itemRenderer,
		},
	];
	// const { id, picturePath, fullName } = useSelector((state) => state.store.auth.user);
	return (
		<>
			<Navbar />
			<Suspense fallback={<div className="text-4xl text-bluegray-700">Loading .....</div>}>
				<main className="grid-container">
					<div className="grid-container-left">
						<Menu model={items} className="w-full surface-card p-2" />
					</div>
					<div className="grid-container-middle">
						<Outlet />
					</div>
					<div className="grid-container-right">test</div>
				</main>
			</Suspense>
		</>
	);
};

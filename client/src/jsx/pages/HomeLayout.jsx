import Navbar from "@components/NavBar";
import { useMediaQuery } from "@mui/material";
import { Badge } from "primereact/badge";
import { Menu } from "primereact/menu";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Loader } from "./../components/Loader";
import {
	selectPostDeleteSuccuss,
	selectPostRespostedSuccuss,
	setPostIsDeletedSuccuss,
	setPostIsRepostedSuccuss,
} from "@store/slices/postSlice";
import { useEffect, useRef, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "primereact/toast";
import { PostDialogForm } from "@jsx/components/PostDialogForm";
import { PostCommentsDialog } from "@jsx/components/PostCommentsDialog";
import { selectCurrentUser } from "@jsx/store/slices/authSlice";
export const HomeLayout = () => {
	const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
	const navigate = useNavigate();
	// Get the current values of isPostDeletedSuccuss and isPostDeletedFails
	const toast = useRef(null);
	const toastShown = useRef(false); // Add a new ref to track whether the toast has been shown
	const isPostDeletedSuccuss = useSelector(selectPostDeleteSuccuss);
	const isPostRepostedSuccuss = useSelector(selectPostRespostedSuccuss);
	const user = useSelector(selectCurrentUser);
	const dispatch = useDispatch();

	// show success message when deleting a post
	useEffect(() => {
		if (isPostDeletedSuccuss && !toastShown.current) {
			toast.current.show({
				severity: "success",
				summary: "Post Deleted 🎉",
				detail: "Your post has been deleted successfully",
				life: 3000,
			});
			toastShown.current = true; // Set toastShown.current to true after showing the toast
			dispatch(setPostIsDeletedSuccuss(false));
		} else if (!isPostDeletedSuccuss) {
			toastShown.current = false; // Reset toastShown.current to false when isPostDeletedSuccuss is false
		}
	}, [isPostDeletedSuccuss, dispatch]);

	// show success message when Reposting a post

	useEffect(() => {
		if (isPostRepostedSuccuss && !toastShown.current) {
			toast.current.show({
				severity: "success",
				summary: "Post Reposted to your feed  🎉",
				detail: "Your post has been reposted successfully",
				life: 3000,
			});
			toastShown.current = true; // Set toastShown.current to true after showing the toast
			dispatch(setPostIsRepostedSuccuss(false));
		} else if (!isPostRepostedSuccuss) {
			toastShown.current = false; // Reset toastShown.current to false when isPostRepostedSuccuss is false
		}
	}, [isPostRepostedSuccuss, dispatch]);



	const itemRenderer = (item) => (
		<div className="p-menuitem-content border-round-xl w-full mb-2">
			<NavLink
				to={item.url}
				className="flex align-items-center border-round-xl p-menuitem-link w-full"
				style={({ isActive, isPending, isTransitioning }) => {
					return {
						fontWeight: isActive ? "bold" : "revert-layer",
						color: isActive ? "var(--primary-300)" : "revert-layer",
						background: isActive ? "var(--surface-0)" : "revert-layer",
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
			label: "Bookmarks",
			icon: "pi pi-bookmark",
			url: "bookmarks",
			template: itemRenderer,
		},
		{
			label: "Profile",
			icon: "pi pi-user",
			url: `profile/${user?.id}`,
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
			<Toast ref={toast} />
			<Navbar />
			<main className="grid-container">
				<div className="grid-container-left">
					<Menu model={items} className="w-full surface-card p-2 autoZIndex" />
				</div>
				<div className="grid-container-middle">
					<Suspense fallback={<Loader />}>
						<Outlet />
					</Suspense>
				</div>
				<div className="grid-container-right">test</div>
			</main>
			<PostDialogForm />
			<PostCommentsDialog />
		</>
	);
};

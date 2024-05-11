/* eslint-disable unicorn/prefer-query-selector */
import ReactDOM from "react-dom/client";
import { Provider as ReduxStoreProvider } from "react-redux";
// import { ThemeProvider } from "@mui/material";
// import { createTheme } from "@mui/material/styles";
import PrivateRoute from "@components/PrivateRoute.jsx";
import App from "@jsx/App.jsx";
import { BookMarks } from "@pages/BookMarks";
import { ForgetPasswordRequest } from "@pages/ForgetPasswordRequest";
import { HomeLayout } from "@pages/HomeLayout";
// import { Login } from "@pages/Login";
import { Register } from "@pages/Register";
import { ResetPassword } from "@pages/ResetPassword";
import "@scss/main.scss";
import { persistor, store } from "@store/store";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import { StrictMode, Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import Error from "./pages/Error";
// const Loading = React.lazy(() => import("@pages/Loading"));
// const Login = lazy(() => import("@pages/Login"));
import { Loader } from "./components/Loader";

const Login = lazy(() => import("@pages/Login").then((module) => ({ default: module.Login })));
const Home = lazy(() => import("@pages/Home").then((module) => ({ default: module.Home })));
const Explore = lazy(() => import("@pages/Explore").then((module) => ({ default: module.Explore })));
const Notifications = lazy(() => import("@pages/Notifications").then((module) => ({ default: module.Notifications })));
const Messages = lazy(() => import("@pages/Messages").then((module) => ({ default: module.Messages })));
const Settings = lazy(() => import("@pages/Settings").then((module) => ({ default: module.Settings })));
const Profile = lazy(() => import("@pages/Profile").then((module) => ({ default: module.Profile })));
// const Scheduler = React.lazy(() => import("@pages/Scheduler"));
// const Orders = React.lazy(() => import("@pages/Orders"));
// const Map = React.lazy(() => import("@pages/Map"));
// const Kanban = React.lazy(() => import("@pages/Kanban"));
// const Employees = React.lazy(() => import("@pages/Employees"));
// const Editor = React.lazy(() => import("@pages/Editor"));
// const Ecommerce = React.lazy(() => import("@pages/Ecommerce"));
// const Drawer = React.lazy(() => import("@pages/Drawer"));
// const Customers = React.lazy(() => import("@pages/Customers"));
// const Analytics = React.lazy(() => import("@pages/Analytics"));


// Nested routes for HomeLayout
const homeRoutes = [
	{
		path: "home",
		element: <Home />,
	},
	{
		path: "explore",
		element: <Explore />,
	},
	{
		path: "notifications",
		element: <Notifications />,
	},
	{
		path: "messages",
		element: <Messages />,
	},
	{
		path: "bookmarks",
		element: <BookMarks />,
	},
	{
		path: "profile/:profileId",
		element: <Profile />,
	},
	{
		path: "settings",
		element: <Settings />,
	},
];



export const router = createBrowserRouter(
	[
		{
			path: "/",
			element: <App />,
			errorElement: <Error />,
			children: [
				//? Public routes
				{
					index: true,
					element: (
						<Suspense fallback={<Loader/>}>
							<Login />
						</Suspense>
					),
					// errorElement: <Error />,
				},
				{
					path: "register",
					element: <Register />,
				},
				{
					path: "forgot-password",
					element: <ForgetPasswordRequest />,
				},
				{
					path: "reset-password",
					element: <ResetPassword />,
				},
				//? Private routes
				{
					element: <PrivateRoute />,
					children: [
						{
							element: <HomeLayout />,
							children: homeRoutes,
						},
					],
				},
			],
		},
	],
	{ basename: import.meta.env.BASE_URL }
);



ReactDOM.createRoot(document.getElementById("root")).render(
	<StrictMode>
		<ReduxStoreProvider store={store}>
			{/* delay the rendering of our app's UI until the persisted data is available in the Redux store. */}
			<PersistGate loading={null} persistor={persistor}>
				<RouterProvider router={router} />
				{/* <RouterProvider router={router} fallbackElement={<Loading />} /> */}
			</PersistGate>
		</ReduxStoreProvider>
	</StrictMode>
);

/* eslint-disable unicorn/prefer-query-selector */
import ReactDOM from "react-dom/client";
import { Provider as ReduxStoreProvider } from "react-redux";
import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { StrictMode } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@store/store";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
// import "primeflex/primeflex.css"
import App from "@jsx/App.jsx";
import Home from "@pages/Home";
import Login from "@pages/Login";
import Register from "@pages/Register";
import Profile from "@pages/Profile";
import PrivateRoute from "@components/PrivateRoute.jsx";
import Error from "./pages/Error";
import "@scss/main.scss";

// const Loading = React.lazy(() => import("@pages/Loading"));
// const Tracker = React.lazy(() => import("@pages/Tracker"));
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
export const router = createBrowserRouter(
	[
		{
			path: "/",
			element: <App />,
			errorElement: <Error />, // the same as <Route path="*" element={<Error />}>
			children: [
				//? Public routes
				{
					// default Outlet route , the same as <Route index element={<LogIn/>} />
					index: true,
					element: <Login />,
				},
				// {
				// 	path: "register",
				// 	element: <Register />,
				// },
				//? Private routes
				// {
				// 	element: <PrivateRoute />,
				// 	children: [
				// 		{
				// 			path: "home",
				// 			element: <Home />,
				// 		},
				// 		{
				// 			path: "profile/:userId",
				// 			element: <Profile />,
				// 		},
				// 	],
				// },
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

/* eslint-disable unicorn/prefer-query-selector */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as ReduxStoreProvider } from "react-redux";


import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "@jsx/App.jsx";
// import Home from "@pages/Home";
// import Error from "@pages/Error";

import { store } from "./store/store";

import "@scss/main.scss";
import "@mantine/core/styles.layer.css";

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
			// errorElement: <Error />,
			children: [
				// {
				// 	index: true,
				// 	element: <Home />,
				// },
				// {
				// 	path: "home",
				// 	element: <Home />,
				// },
				// {
				// 	path: "auth",
				// 	element: <Auth />,
				// },
				// {
				// 	path: "employees",
				// 	element: <Employees />,
				// },
				// {
				// 	path: "customers",
				// 	element: <Customers />,
				// },
				// {
				// 	path: "scheduler",
				// 	element: <Scheduler />,
				// },
				// {
				// 	path: "kanban",
				// 	element: <Kanban />,
				// },
				// {
				// 	path: "markdawn-editor",
				// 	element: <Editor />,
				// },
				// {
				// 	path: "drawer",
				// 	element: <Drawer />,
				// },
				// {
				// 	path: "analytics",
				// 	element: <Analytics />,
				// },
				// {
				// 	path: "tracker",
				// 	element: <Tracker />,
				// },
				// {
				// 	path: "map",
				// 	element: <Map />,
				// },
			],
		},
	],
	{ basename: import.meta.env.BASE_URL }
);


ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<MantineProvider theme={theme} defaultColorScheme="auto">
			<ReduxStoreProvider store={store}>
				{/* <RouterProvider router={router} fallbackElement={<Loading />} /> */}
				<RouterProvider router={router}  />
			</ReduxStoreProvider>
		</MantineProvider>
	</React.StrictMode>
);

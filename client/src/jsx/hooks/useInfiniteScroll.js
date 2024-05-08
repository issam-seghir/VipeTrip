import { api } from "@store/api/api";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-cool-inview"; // https://www.npmjs.com/package/react-cool-inview

const useInfiniteScroll = (endpointName, queryParameters, queryOptions) => {
	const [page, setPage] = useState(1);
	const [combinedData, setCombinedData] = useState([]);
	console.log(combinedData);

	const [trigger, { data: { data: currentData = [], ...pagination } = {}, isLoading, isFetching }, lastPromiseInfo] =
		api.endpoints[endpointName].useLazyQuery(queryOptions); // https://redux-toolkit.js.org/rtk-query/api/created-api/hooks#uselazyquery

	const { observe } = useInView({
		threshold: 0.8, // default is 0
		// When the last item comes to the viewport
		onEnter: ({ unobserve }) => {
			// Pause observe when loading data
			unobserve();
			// Load more data
			if (pagination?.next_page_url !== null && !isFetching) {
				setPage((page) => page + 1);
			}
		},
	}); // https://www.npmjs.com/package/react-cool-inview#infinite-scroll

	useEffect(() => {

		// Add a subscription
		const result = trigger({
			page,
			limit: 15,
			...queryParameters,
		})
			.unwrap()
			.then((data) => {
				setCombinedData((previousData) => {
					// Check if data for new page is already in combinedData
					const newData = data.filter((item) => !previousData.some((prevItem) => prevItem.id === item.id));
					return [...previousData, ...newData];
				});
			}) //! data shape based on transform responce
			.catch(console.error);
		// Return the `unsubscribe` callback to be called in the `useEffect` cleanup step
		return result.unsubscribe;
		// See Option 3. https://github.com/facebook/react/issues/14476#issuecomment-471199055
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [trigger, page, JSON.stringify(queryParameters)]);

	const refresh = useCallback(() => {
		setPage(1);
	}, []);

	return {
		combinedData,
		currentData, // current page data
		page,
		refresh,
		isLoading,
		isFetching,
		itemRef: observe,
		lastArg: lastPromiseInfo.lastArg,
	};
};

export default useInfiniteScroll;

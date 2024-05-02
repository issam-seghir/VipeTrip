import { StoriesSection } from "@jsx/components/StoriesSection";
import { CreatePostSection } from "@components/CreatePostSection";
import { FeedPostsSection } from "./../components/FeedPostsSection";


export function Explore() {

	return (
		<>
			<StoriesSection />
			<CreatePostSection />
			<FeedPostsSection/>
		</>
	);
}

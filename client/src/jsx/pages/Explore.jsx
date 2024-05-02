import { StoriesSection } from "@jsx/components/StoriesSection";
import { CreatePostSection } from "@components/CreatePostSection";
import { FeedPostsSection } from "./../components/FeedPostsSection";


export function Explore() {

	return (
		<div className="flex flex-column gap-4">
			<StoriesSection />
			<CreatePostSection />
			<FeedPostsSection/>
		</div>
	);
}

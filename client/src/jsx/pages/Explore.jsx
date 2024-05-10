import { CreatePostWidget } from "@components/CreatePostWidget";
import { FeedPostsSection } from "@components/FeedPostsSection";
import { StoriesSection } from "@jsx/components/StoriesSection";
import { useState } from "react";

export function Explore() {

	return (
		<div className="flex flex-column gap-4">
			<StoriesSection />
			<CreatePostWidget/>
			<FeedPostsSection />
		</div>
	);
}

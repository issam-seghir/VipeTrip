import { CreatePostWidget } from "@components/CreatePostWidget";
import { FeedPostsSection } from "@components/FeedPostsSection";
import { PostDialogForm } from "@jsx/components/PostDialogForm";
import { StoriesSection } from "@jsx/components/StoriesSection";
import { useState } from "react";

export function Explore() {
	const [showPostDialogForm, setShowPostDialogForm] = useState({ open: false, id: null });

	return (
		<div className="flex flex-column gap-4">
			<StoriesSection />
			<CreatePostWidget onClick={() => setShowPostDialogForm({ open: true, id: null })} />
			<FeedPostsSection setShowDialog={setShowPostDialogForm} />
			<PostDialogForm showDialog={showPostDialogForm} setShowDialog={setShowPostDialogForm} />
		</div>
	);
}

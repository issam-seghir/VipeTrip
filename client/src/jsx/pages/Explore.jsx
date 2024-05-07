import { CreatePostWidget } from "@components/CreatePostWidget";
import { FeedPostsSection } from "@components/FeedPostsSection";
import { PostDialogForm } from "@jsx/components/PostDialogForm";
import { PostCommentsDialog } from "@jsx/components/PostCommentsDialog";
import { StoriesSection } from "@jsx/components/StoriesSection";
import { useState } from "react";

export function Explore() {
	const [showPostDialogForm, setShowPostDialogForm] = useState({ open: false, id: null });
	const [showPostCommentsDialog, setShowPostCommentsDialog] = useState({ open: false, id: null });

	return (
		<div className="flex flex-column gap-4">
			<StoriesSection />
			<CreatePostWidget onClick={() => setShowPostDialogForm({ open: true, id: null })} />
			<FeedPostsSection setShowDialog={setShowPostDialogForm} setShowCommentDialog={setShowPostCommentsDialog} />
			<PostDialogForm showDialog={showPostDialogForm} setShowDialog={setShowPostDialogForm} />
			<PostCommentsDialog showDialog={showPostCommentsDialog} setShowDialog={setShowPostCommentsDialog} />
		</div>
	);
}

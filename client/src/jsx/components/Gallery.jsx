import { LazyLoadImage, trackWindowScroll } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const serverUrl = import.meta.env.VITE_SERVER_URL;

// Wrap Gallery with trackWindowScroll HOC so it receives
// a scrollPosition prop to pass down to the images
const TrackedGallery = ({ images, scrollPosition }) => {
	    const gridClass =
			images.length === 1 ? "one" : images.length === 2 ? "two" : images.length === 3 ? "three" : images.length === 4 ? "four" : "five";

	return (
		<div className={`image-grid ${gridClass}`}>
			{images?.map((imgPath, index) => (
				<div key={index} className={`image-item`}>
					<LazyLoadImage
						className={`image  border-round-xl`}
						src={`${serverUrl}/${imgPath}`}
						alt={`Post ${index}`}
						wrapperProps={{
							// If you need to, you can tweak the effect transition using the wrapper style.
							style: { transitionDelay: "1s" },
						}}
						scrollPosition={scrollPosition}
						effect="blur"
					/>
				</div>
			))}
		</div>
	);
};

export const Gallery = trackWindowScroll(TrackedGallery);

import { LazyLoadImage, trackWindowScroll } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const serverUrl = import.meta.env.VITE_SERVER_URL;

// Wrap Gallery with trackWindowScroll HOC so it receives
// a scrollPosition prop to pass down to the images
const TrackedGallery = ({ images, scrollPosition }) => {
	return (
		<div className={`image-grid`}>
			{images?.map((imgPath, index) => (
				<div key={index} className={`image-${index + 1} `}>
					<LazyLoadImage
						className={`image image-${index + 1} border-round-xl`}
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

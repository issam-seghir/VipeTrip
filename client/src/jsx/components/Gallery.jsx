import { Galleria } from "primereact/galleria";
import { useRef, useState } from "react";
import { LazyLoadImage, trackWindowScroll } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const serverUrl = import.meta.env.VITE_SERVER_URL;

// Wrap Gallery with trackWindowScroll HOC so it receives
// a scrollPosition prop to pass down to the images
const TrackedGallery = ({ images, scrollPosition }) => {
	const gridClass =
		images.length === 1
			? "one"
			: images.length === 2
			? "two"
			: images.length === 3
			? "three"
			: images.length === 4
			? "four"
			: "five";
	const [activeIndex, setActiveIndex] = useState(0);
	const galleria = useRef(null);

	const itemTemplate = (item) => {
		return (
			<LazyLoadImage
				className={`image  border-round-xl`}
				src={`${serverUrl}/${item}`}
				alt="Gallery item"
				placeholder={<div>loading ...... </div>} // Display a spinner while the image is loading
				effect="blur"
			/>
		);
	};

	const thumbnailTemplate = (item) => {
		return (
			<LazyLoadImage
				className={`image  border-round-xl`}
				src={`${serverUrl}/${item}`}
				alt="Gallery item"
				placeholder={<div>loading ...... </div>} // Display a spinner while the image is loading
				effect="blur"
			/>
		);
	};

	return (
		<div className={`image-grid ${gridClass}`}>
			<Galleria
				ref={galleria}
				value={images}
				numVisible={7}
				style={{ maxWidth: "1250px" }}
				activeIndex={activeIndex}
				onItemChange={(e) => setActiveIndex(e.index)}
				circular
				fullScreen
				showItemNavigators={images.length > 1} // Show arrow buttons only if there is more than one image
				showThumbnails={false}
				item={itemTemplate}
				thumbnail={thumbnailTemplate}
			/>
			{images?.map((imgPath, index) => (
				<div key={index} className={`image-item border-round-xl cursor-pointer`}>
					<LazyLoadImage
						className={`image  border-round-xl`}
						src={`${serverUrl}/${imgPath}`}
						alt={`Post ${index}`}
						wrapperProps={{
							// If you need to, you can tweak the effect transition using the wrapper style.
							style: { transitionDelay: "1s" },
						}}
						scrollPosition={scrollPosition}
						placeholder={<div>loading ...... </div>} // Display a spinner while the image is loading
						effect="blur"
						onClick={() => {
							setActiveIndex(index);
							galleria.current.show();
						}}
					/>
				</div>
			))}
		</div>
	);
};

export const Gallery = trackWindowScroll(TrackedGallery);

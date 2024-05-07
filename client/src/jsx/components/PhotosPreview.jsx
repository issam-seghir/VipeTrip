import { Button } from "primereact/button";

const serverUrl = import.meta.env.VITE_SERVER_URL;

export function PhotosPreview({ photos = [], existingImages = [], onPhotoRemove, disabled = false }) {
	const newPhotos = [...existingImages, ...photos];
	return (
		<div className="flex gap-2">
			{newPhotos.map((photo, index) => (
				<div key={index} className="relative cover w-8rem h-10rem">
					<img
						src={photo?.objectURL || `${serverUrl}/${photo}`}
						alt={photo?.name}
						className=" border-round-md"
					/>
					<Button
						disabled={disabled}
						type="button"
						icon="pi pi-times"
						style={{ width: "1.75rem", height: "1.75rem" }}
						className="absolute top-0 left-0  m-1 z-5 border-circle p-button-danger"
						onClick={() => onPhotoRemove(photo, index)}
					/>
				</div>
			))}
		</div>
	);
}

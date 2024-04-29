import React from 'react'
import { Button } from "primereact/button";

export  function PhotosPreview({ photos, onPhotoRemove }) {
	return (
		<div className="flex gap-2">
			{photos.map((photo, index) => (
				<div key={index} className="relative cover w-8rem h-10rem">
					<img src={photo?.objectURL} alt={photo?.name} className=" border-round-md" />
					<Button
						type="button"
						icon="pi pi-times"
						style={{ width: "1.75rem" , height: "1.75rem" }}
						className="absolute top-0 left-0  m-1 z-5 border-circle p-button-danger"
						onClick={() => onPhotoRemove(photo, index)}
					/>
				</div>
			))}
		</div>
	);
}

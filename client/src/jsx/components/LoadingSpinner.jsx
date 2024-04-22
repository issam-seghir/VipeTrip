import { ProgressSpinner } from "primereact/progressspinner";

export function LoadingSpinner() {
	return (
		<div className="card">
			<ProgressSpinner
				style={{ width: "20px", height: "20px" }}
				strokeWidth="4"
				// fill="var(--surface-ground)"
				animationDuration=".5s"
			/>
		</div>
	);
}

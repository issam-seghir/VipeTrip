import React from "react";

const styles = {
	container: {
		"--uib-size": "30px",
		"--uib-color": "black",
		"--uib-speed": "1.75s",
		position: "relative",
		height: "var(--uib-size)",
		width: "var(--uib-size)",
		filter: "url('#uib-jelly-triangle-ooze')",
	},
	dot: {
		content: "",
		position: "absolute",
		width: "33%",
		height: "33%",
		backgroundColor: "var(--uib-color)",
		borderRadius: "100%",
		willChange: "transform",
		transition: "background-color 0.3s ease",
		top: "6%",
		left: "30%",
		animation: "grow var(--uib-speed) ease infinite",
	},
	traveler: {
		position: "absolute",
		top: "6%",
		left: "30%",
		width: "33%",
		height: "33%",
		backgroundColor: "var(--uib-color)",
		borderRadius: "100%",
		animation: "triangulate var(--uib-speed) ease infinite",
		transition: "background-color 0.3s ease",
	},
	svg: {
		width: 0,
		height: 0,
		position: "absolute",
	},
};

export const Loader = () => (
	<div>
		<div style={styles.container}>
			<div style={styles.dot}></div>
			<div style={styles.traveler}></div>
		</div>
		<svg width="0" height="0" style={styles.svg}>
			<defs>
				<filter id="uib-jelly-triangle-ooze">
					<feGaussianBlur in="SourceGraphic" stdDeviation="3.333" result="blur" />
					<feColorMatrix
						in="blur"
						mode="matrix"
						values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
						result="ooze"
					/>
					<feBlend in="SourceGraphic" in2="ooze" />
				</filter>
			</defs>
		</svg>
	</div>
);


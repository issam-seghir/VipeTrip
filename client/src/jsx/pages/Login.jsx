import { AuthForm } from "@jsx/components/AuthForm";
import { useState } from "react";
// import { classNames } from "primereact/utils";
import sectionImg1 from "@assets/images/Autumn Biking Companions.png";
import sectionImg2 from "@assets/images/Contemplative Urban Dreamer.png";
import sectionImg3 from "@assets/images/wallpaper.png";

import Logo from "@svg/logo.svg?react";
// import logo from "@svg/logo.svg?url";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Galleria } from "primereact/galleria";

export default function Login() {
	const [checked, setChecked] = useState(false);

	// for Galleria Component
	const images = [
		{ svg: sectionImg1, alt: "section1" },
		{ svg: sectionImg2, alt: "section2" },
		{ svg: sectionImg3, alt: "section3" },
	];
	const responsiveOptions = [
		{
			breakpoint: "767px",
			numVisible: 1,
		},
	];
	const itemTemplate = (item) => {
		return (
			<img
				src={item.svg}
				alt={item.alt}
				className="h-full w-full"
				style={{
					clipPath: "polygon(8% 0, 100% 0%, 100% 100%, 0 100%)",
					objectFit: "cover",
				}}
			/>
		);
	};

	const [ingredients, setIngredients] = useState([]);
	const onIngredientsChange = (e) => {
		let _ingredients = [...ingredients];

		if (e.checked) _ingredients.push(e.value);
		else _ingredients.splice(_ingredients.indexOf(e.value), 1);

		setIngredients(_ingredients);
	};
	return (
		<div className="flex viewport">
			<div className="flex-center" style={{ flex: "50%" }}>
				<div className="surface-card p-4 shadow-2 border-round w-full lg:w-7">
					<div className="flex-center mb-4">
						<Logo
							className={"surface-card logo"}
							style={{ transition: "all 2s linear" }}
						/>
					</div>
					<div className="text-center flex-center flex-column gap-1 mb-4">
						<div className="text-900 lg:text-3xl md:text-xl text-sm font-medium">
							Welcome Back
						</div>
						<div className="text-900 lg:text-3xl md:text-xl text-sm font-medium">
							to <span className="text-primary text-animate">VipeTrip</span>
						</div>
					</div>
					<AuthForm />
					<div>
						<div className="flex align-items-center justify-content-between mb-6">
							<div className="flex align-items-center">
								<Checkbox
									id="rememberme"
									onChange={(e) => setChecked(e.checked)}
									checked={checked}
									className="mr-2"
								/>
								<label htmlFor="rememberme">Remember me</label>
							</div>
							<a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">
								Forgot your password?
							</a>
						</div>

						<Button label="Sign In" icon="pi pi-user" className="w-full" />
					</div>
				</div>
				{/* <section>
				<span className="text-600 font-medium line-height-3">Don&apos;t have an account?</span>
						<a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer" href="#">
							Create today!
						</a>
          <span className="block text-6xl font-bold mb-1">
            Welcome To VipeTrip
          </span>
          <div className="text-6xl  text-primary font-bold mb-3">
            your trip begien here !!
          </div>
          <div className="text-2xl  text-primary font-bold mb-3">Sign In</div>
        </section> */}
			</div>

			<Galleria
				value={images}
				responsiveOptions={responsiveOptions}
				numVisible={3}
				item={itemTemplate}
				circular
				autoPlay
				showItemNavigators={false}
				showIndicators={false}
				showThumbnails={false}
				style={{ flex: "30%" }}
				transitionInterval={4000}
				transitionOptions={{ classNames: "fade" }}
				pt={{
					content: "h-full",
					itemWrapper: "h-full",
					transition: {
						enterFromClass: "opacity-0 scale-75",
						enterActiveClass:
							"transition-transform transition-opacity duration-150 ease-in",
						leaveActiveClass: "transition-opacity duration-150 ease-linear",
						leaveToClass: "opacity-0",
					},
				}}
			/>
		</div>
	);
}

import { AuthForm } from "@jsx/components/AuthForm";
import { useState } from "react";
// import { classNames } from "primereact/utils";
import sectionImg1 from "@assets/images/Autumn Biking Companions.png";
import sectionImg2 from "@assets/images/Contemplative Urban Dreamer.png";
import sectionImg3 from "@assets/images/wallpaper.png";

import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Image } from "primereact/image";
import { InputText } from "primereact/inputtext";
import logo from "/logo/social-vimeo-svgrepo-com (2).svg?svg";
import { Galleria } from "primereact/galleria";

export default function Login() {
	const [ingredients, setIngredients] = useState([]);
	const [checked, setChecked] = useState(false);
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
		return <img src={item.svg} alt={item.alt} className="cover-fill h-full" style={{clipPath: "polygon(8% 0, 100% 0%, 100% 100%, 0 100%)" ,objectFit:"cover"}} />;
	};
	const onIngredientsChange = (e) => {
		let _ingredients = [...ingredients];

		if (e.checked) _ingredients.push(e.value);
		else _ingredients.splice(_ingredients.indexOf(e.value), 1);

		setIngredients(_ingredients);
	};
	return (
		<div className="flex viewport">
			<div className="flex-center" style={{ flex: "50%" }}>
				<div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
					<div className="text-center mb-5">
						<a href="https://vitejs.dev" target="_blank" rel="noreferrer">
							<img src={logo} alt="logo" />
						</a>
						<div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
						<span className="text-600 font-medium line-height-3">Don&apos;t have an account?</span>
						<a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer" href="#">
							Create today!
						</a>
					</div>
					<div>
						<label htmlFor="email" className="block text-900 font-medium mb-2">
							Email
						</label>
						<InputText id="email" type="email" placeholder="example@mail.com" className="w-full mb-3" />

						<label htmlFor="password" className="block text-900 font-medium mb-2">
							Password
						</label>
						<InputText id="password" type="password" placeholder="Password" className="w-full mb-3" />

						<div className="flex align-items-center justify-content-between mb-6">
							<div className="flex align-items-center">
								<Checkbox id="rememberme" onChange={(e) => setChecked(e.checked)} checked={checked} className="mr-2" />
								<label htmlFor="rememberme">Remember me</label>
							</div>
							<a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot your password?</a>
						</div>

						<Button label="Sign In" icon="pi pi-user" className="w-full" />
					</div>
					<AuthForm />
				</div>
				{/* <section>
          <span className="block text-6xl font-bold mb-1">
            Welcome To VipeTrip
          </span>
          <div className="text-6xl  text-primary font-bold mb-3">
            your trip begien here !!
          </div>
          <div className="text-2xl  text-primary font-bold mb-3">Sign In</div>
        </section> */}
			</div>

			{/* <Image
				alt="cover"
				className="cover"
				src={sectionImg1}
				style={{
					flex: "50%",
				}}
				imageStyle={{
					clipPath: "polygon(8% 0, 100% 0%, 100% 100%, 0 100%)",
				}}
			/> */}
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
				transitionInterval={2000}
				transitionOptions={{
					classNames: "fade",
				}}
				pt={{
					content: "h-full",
					itemWrapper: "h-full",
					transition: {
						enterFromClass: "opacity-0 scale-75",
						enterActiveClass: "transition-all duration-150 ease-in-out",
						leaveActiveClass: "transition-all duration-150 ease-in",
						leaveToClass: "opacity-0 scale-75",
					},
				}}
			/>
		</div>
	);
}

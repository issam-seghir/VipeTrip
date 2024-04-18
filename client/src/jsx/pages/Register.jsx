import { RegisterForm } from "@jsx/components/RegisterForm";
import sectionImg1 from "@assets/images/Autumn Biking Companions.png";
import sectionImg2 from "@assets/images/Contemplative Urban Dreamer.png";
import sectionImg3 from "@assets/images/wallpaper.png";
import sectionImg4 from "@assets/images/poster.png";
import sectionImg5 from "@assets/images/Contemporary Billiards Lounge with Ambient Lighting.png";
import { LoginLayout } from "@jsx/components/LoginLayout";

import Logo from "@svg/logo.svg?react";
// import logo from "@svg/logo.svg?url";
import { Galleria } from "primereact/galleria";

export function Register() {
  // for Galleria Component
  // const images = [
  //   { svg: sectionImg1, alt: "section1" },
  //   { svg: sectionImg2, alt: "section2" },
  //   { svg: sectionImg3, alt: "section3" },
  //   { svg: sectionImg4, alt: "section4" },
  //   { svg: sectionImg5, alt: "section5" },
  // ];
  // const responsiveOptions = [
  //   {
  //     breakpoint: "767px",
  //     numVisible: 1,
  //   },
  // ];
  // const itemTemplate = (item) => {
  //   return (
  //     <img
  //       src={item.svg}
  //       alt={item.alt}
  //       className="h-full w-full"
  //       style={{
  //         // clipPath: "polygon(30% 0, 80% 20%, 100% 80%, 0 80%)",
  //         objectFit: "cover",
  //       }}
  //     />
  //   );
  // };

  return (
    	<LoginLayout formType="register">
			          <RegisterForm />

		</LoginLayout>


  );
}

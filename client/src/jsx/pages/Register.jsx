import { RegisterForm } from "@jsx/components/RegisterForm";
import sectionImg1 from "@assets/images/Autumn Biking Companions.png";
import sectionImg2 from "@assets/images/Contemplative Urban Dreamer.png";
import sectionImg3 from "@assets/images/wallpaper.png";
import sectionImg4 from "@assets/images/poster.png";
import sectionImg5 from "@assets/images/Contemporary Billiards Lounge with Ambient Lighting.png";

import Logo from "@svg/logo.svg?react";
// import logo from "@svg/logo.svg?url";
import { Galleria } from "primereact/galleria";

export function Register() {
  // for Galleria Component
  const images = [
    { svg: sectionImg1, alt: "section1" },
    { svg: sectionImg2, alt: "section2" },
    { svg: sectionImg3, alt: "section3" },
    { svg: sectionImg4, alt: "section4" },
    { svg: sectionImg5, alt: "section5" },
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
          // clipPath: "polygon(30% 0, 80% 20%, 100% 80%, 0 80%)",
          objectFit: "cover",
        }}
      />
    );
  };

  return (
    <div className="flex viewport">
      <div className="flex-center" style={{ flex: "50%" }}>
        <div className="surface-card px-4 py-4 w-11 shadow-2 border-round sm:w-9 md:w-8 lg:w-9  xl:w-8 ">
          <div className="flex-center mb-4">
            <Logo
              className={"surface-card logo"}
              style={{ transition: "all 2s linear" }}
            />
          </div>
          <div className="text-center flex-center flex-column gap-1 mb-6">
            <div className="text-900 lg:text-3xl md:text-2xl text-xl font-medium">
              Your New Social Trip
            </div>
            <div className="text-900 lg:text-3xl md:text-2xl text-xl font-medium">
              Starts With{" "}
              <span className="text-primary text-animate">VipeTrip</span>
            </div>
          </div>
          <RegisterForm />
        </div>
      </div>

      <Galleria
        value={images}
        responsiveOptions={responsiveOptions}
        numVisible={3}
        item={itemTemplate}
        circular
        // autoPlay
        showItemNavigators={false}
        showIndicators={false}
        showThumbnails={false}
        className="galleria-img lg:block hidden"
        style={{ flex: "40%" }}
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

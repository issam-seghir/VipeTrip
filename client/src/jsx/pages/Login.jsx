import { AuthForm } from "@jsx/components/AuthForm";
import { Settings } from "@pages/Settings";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import React, { useState } from "react";
import { classNames } from "primereact/utils";
import sectionImg from "@assets/images/Autumn Biking Companions.png";

import { Image } from "primereact/image";

export default function Login() {
  const [ingredients, setIngredients] = useState([]);

  const onIngredientsChange = (e) => {
    let _ingredients = [...ingredients];

    if (e.checked) _ingredients.push(e.value);
    else _ingredients.splice(_ingredients.indexOf(e.value), 1);

    setIngredients(_ingredients);
  };
  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className=" p-6 text-center md:text-left flex align-items-center"
        style={{ flex: "50%" }}
      >
        <section>
          <span className="block text-6xl font-bold mb-1">
            Welcome To VipeTrip
          </span>
          <div className="text-6xl  text-primary font-bold mb-3">
            your trip begien here !!
          </div>
          <div className="text-2xl  text-primary font-bold mb-3">Sign In</div>
        </section>
      </div>
      <div
        style={{
          flex: "50%",
        }}
      >
        <img
          src={sectionImg}
          alt="section"
          style={{
            clipPath: "polygon(8% 0, 100% 0%, 100% 100%, 0 100%)",
            objectFit: "cover",
          }}
        />
        {/* <Image
          style={{ flex: "50%" }}
          imageStyle={{
            clipPath: "polygon(8% 0, 100% 0%, 100% 100%, 0 100%)",
            objectFit: "cover",
          }}
          src={sectionImg}
          alt="section"
        /> */}
      </div>
    </div>
  );
}

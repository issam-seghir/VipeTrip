import { AuthForm } from "@jsx/components/AuthForm";
import { Settings } from "@pages/Settings";
import { Checkbox } from "primereact/checkbox";
import React, { useState } from "react";


export default function Login() {
	    const [ingredients, setIngredients] = useState([]);

		const onIngredientsChange = (e) => {
			let _ingredients = [...ingredients];

			if (e.checked) _ingredients.push(e.value);
			else _ingredients.splice(_ingredients.indexOf(e.value), 1);

			setIngredients(_ingredients);
		};
	return (
		<div className="card flex flex-wrap justify-content-center gap-3">
			<div className="flex align-items-center">
				<Checkbox inputId="ingredient1" name="pizza" value="Cheese" onChange={onIngredientsChange} checked={ingredients.includes("Cheese")} />
				<label htmlFor="ingredient1" className="ml-2">
					Cheese
				</label>
			</div>
			<div className="flex align-items-center">
				<Checkbox inputId="ingredient2" name="pizza" value="Mushroom" onChange={onIngredientsChange} checked={ingredients.includes("Mushroom")} />
				<label htmlFor="ingredient2" className="ml-2">
					Mushroom
				</label>
			</div>
			<div className="flex align-items-center">
				<Checkbox inputId="ingredient3" name="pizza" value="Pepper" onChange={onIngredientsChange} checked={ingredients.includes("Pepper")} />
				<label htmlFor="ingredient3" className="ml-2">
					Pepper
				</label>
			</div>
			<div className="flex align-items-center">
				<Checkbox inputId="ingredient4" name="pizza" value="Onion" onChange={onIngredientsChange} checked={ingredients.includes("Onion")} />
				<label htmlFor="ingredient4" className="ml-2">
					Onion
				</label>
			</div>
		</div>

		// <FormLayout>
		// <AuthForm />
		// </FormLayout>
	);
}

import React from 'react'
import FormLayout from "@components/FormLayout"
import RegisterForm from "@components/RegisterForm";

export default function Register() {
  return (
		<FormLayout>
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
			<RegisterForm />
		</FormLayout>
  );
}

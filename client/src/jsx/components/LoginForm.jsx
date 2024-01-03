import { useForm, Form } from "react-hook-form";
import { useState, useRef,useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "@components/FlexBetween";

import { z } from "zod";
import { DevTool } from "@hookform/devtools";
import {zodResolver} from '@hookform/resolvers/zod';


const LoginSchema = z.object({
	firstName: z.string().min(3).max(15),
	lastName: z.string().min(3).max(15),
	age: z.number().min(18).max(99),
}).refine((data) => {
  data.firstName !== data.lastName
  },
  {
    message: "First name and last name must be different",
    path:["firstName", "lastName"]
  },
  );

// LoginSchema.parse({ firstName: "Ludwig" });



export default function LoginForm() {
  const {
		register,
		handleSubmit,
		watch, // wathc input change (use devtool instead)
		reset, // clear the form ( for example after successful submit)
		setValue,
		control,
		formState: { errors, isValid, isValidating, isSubmitSuccessful, isSubmitted, isLoading, isSubmitting },
  } = useForm({
		mode: "onChange",
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			// firstName: "test",
			// password: "123",
			//  isLogin ? initialValuesLogin : initialValuesRegister,
		},
  });

  const onSubmit = useCallback((data) => {
    // fetch data
    console.log(data);
    isSubmitting ? console.log("submitting ...") : console.log("sub completed");
    //reset form after submit
  }, []);
  console.log(errors);

    return (
		/* "handleSubmit" will validate your inputs before invoking "onSubmit" */
		<>
			<DevTool control={control} placement="top-left" />
			<Form
				onSubmit={handleSubmit(onSubmit)}
				// action="/api/save" // Send post request with the FormData
				// encType={'application/json'} you can also switch to json object
				onSuccess={() => {
					alert("Your application is updated.");
				}}
				onError={() => {
					alert("Submission has failed.");
				}}
				control={control}
			>
				<input {...register("password")} />
				<span>{errors.password?.message}</span>
				{/* {errors.password && <span>This field is required</span>} */}
				<TextField label="First Name" {...register("firstName")} error={Boolean(errors.firstName)} helperText={errors.firstName?.message} sx={{ gridColumn: "span 2" }} />
				<TextField label="Last Name" {...register("lastName")} error={Boolean(errors.lastName)} helperText={errors.lastName?.message} sx={{ gridColumn: "span 2" }} />
				<TextField label="Number" {...register("age")} error={Boolean(errors.age)} helperText={errors.age?.message} sx={{ gridColumn: "span 2" }} />
				<input type="submit" />
			</Form>
		</>
	);
}



// In your JSX
  {/* ... */}

  {/* ...

  <form onSubmit={handleSubmit(onSubmit)}>

  <Button
    fullWidth
    type="submit"
    sx={{
      m: '2rem 0',
      p: '1rem',
      backgroundColor: palette.primary.main,
      color: palette.background.alt,
      '&:hover': { color: palette.primary.main },
    }}
  >
    {isLogin ? 'LOGIN' : 'REGISTER'}
  </Button>
  <Typography
    onClick={() => {
      setPageType(isLogin ? 'register' : 'login');
      reset();
    }}
    sx={{
      textDecoration: 'underline',
      color: palette.primary.main,
      '&:hover': {
        cursor: 'pointer',
        color: palette.primary.light,
      },
    }}
  >
    {isLogin
      ? "Don't have an account? Sign Up here."
      : 'Already have an account? Login here.'}
  </Typography>
</form>



  */}

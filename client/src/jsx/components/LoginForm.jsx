import { useForm } from "react-hook-form"
import { useState, useRef } from "react";
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


export default function LoginForm() {
  const {
		register,
		handleSubmit,
		watch,
		reset,
		setValue,
		formState: { errors },
  } = useForm({
		defaultValues: {
			// firstName: "test",
			// password: "123",
      //  isLogin ? initialValuesLogin : initialValuesRegister,
      //  resolver: isLogin ? loginResolver : registerResolver, // You need to create these resolvers using `yupResolver` from `@hookform/resolvers/yup`
		},
  });

  function handleFormSubmit(data) {
    console.log(data);
  }
  const onSubmit = (data) => handleFormSubmit(data)

  console.log(watch("firstName")); // watch input value by passing the name of it


    return (
		/* "handleSubmit" will validate your inputs before invoking "onSubmit" */
		<form onSubmit={handleSubmit(onSubmit)}>
			<input {...register("password", { required: true, minLength: 4 })} />
			<span>{errors.password?.message}</span>
			{/* {errors.password && <span>This field is required</span>} */}
			<TextField label="First Name" {...register("firstName", { required: "this is required", minLength: { value: 4, message: "min length 4" } })} error={Boolean(errors.firstName)} helperText={errors.firstName?.message} sx={{ gridColumn: "span 2" }} />
			<TextField label="Last Name" {...register("lastName", { required: "this is required", pattern: /^[a-z]+$/i })} error={Boolean(errors.lastName)} helperText={errors.lastName?.message} sx={{ gridColumn: "span 2" }} />
			<TextField label="Number" type="number" {...register("age", { required: "this is required", min: { value: 18, message: "min 18 " }, max: 99 })} error={Boolean(errors.age)} helperText={errors.age?.message} sx={{ gridColumn: "span 2" }} />
			<input type="submit" />
		</form>
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

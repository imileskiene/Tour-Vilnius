import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Container,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const signup_url =
    import.meta.env.VITE_SINGUP || "http://localhost:3005/v1/users/signup";

    const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError: setFormError,
  } = useForm({
    defaultValues: {
      name: "",
      lastname: "",
      email: "",
      phone_number: "",
      password: "",
      repeatPassword: "",
    },
  });

  const password = watch("password");

  async function onSubmit(values) {
    if (values.password !== values.repeatPassword) {
      setFormError("repeatPassword", {
        type: "manual",
        message: "The passwords do not match",
      });
      return;
    }

    try {
      const { status, data } = await axios.post(signup_url, values);
    
      if (status === 201) {
        window.localStorage.setItem("token", data);
        toast.success("Signup successful!");
        setTimeout(() => {
            navigate('/');
        }, 1000);
      }
    } catch (error) {
        console.log("Error response:", error.response); 
      if (error.response) {
        if (
          error.response.status === 409 &&
          error.response.data.message === "Password is occupied"
        ) {
          setFormError("password", {
            type: "manual",
            message: "Such a password has already been created",
          });
        } else if (
          error.response.status === 409 &&
          error.response.data.message === "Email is occupied"
        ) {
          setFormError("email", {
            type: "manual",
            message: "Such email The email address has already been created",
          });
        } else {
          // console.log(error);
          toast.error("Something went wrong, please try again.");
        }
      }
    }
  }
  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Registracija
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="First Name"
              name="name"
            //   autoComplete="given-name"
              autoFocus
              {...register("name", {
                required: "Please enter your name",
                maxLength: {
                  value: 100,
                  message: "First Name must be less than 100 characters",
                },
                validate: {
                  notEmpty: (value) =>
                    value.trim() !== "" ||
                    "Title cannot be empty or just whitespace",
                },
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastname"
              label="Last Name"
              name="lastname"
            // autoComplete="family-name"
              autoFocus
              {...register("lastname", {
                required: "Please enter your Last Name",
                maxLength: {
                  value: 100,
                  message: "Last Name must be less than 100 characters",
                },
                validate: {
                  notEmpty: (value) =>
                    value.trim() !== "" ||
                    "Title cannot be empty or just whitespace",
                },
              })}
              error={!!errors.lastname}
              helperText={errors.lastname?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
            //   autoComplete="email"
              autoFocus
              {...register("email", {
                required: "Please enter your email",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address format",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="phone"
              label="Telefono numeris"
              name="phone_number"
            // autoComplete="tel"
              autoFocus
              {...register("phone_number", {
                required: "Prašome suvesti savo telefono numerį",
                  pattern: {
                    value: /^\+\d{11}$/,
                    message: 'Telefono numeris turi prasidėti pliuso ženklu ir turėti 11 skaitmenų',
                  },
              })}
              error={!!errors.email}
              helperText={errors.phone?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
            //   autoComplete="current-password"
              {...register("password", {
                required: "Please enter your password",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
                maxLength: {
                  value: 100,
                  message: "Password must be at most 20 characters long",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/,
                  message:
                    "Password must include at least one uppercase letter, one lowercase letter, and one symbol",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="repeatPassword"
              label="Password Confirm"
              type="password"
              id="repeatPassword"
            //   autoComplete="new-password"
              {...register("repeatPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "The passwords do not match",
              })}
              error={!!errors.repeatPassword}
              helperText={errors.repeatPassword?.message}
            />
            <Button
              id="buttonsignup"
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: "#ff8a65",
                "&:hover": {
                  bgcolor: "#ff7043",
                },
              }}
            >
              Registracija
            </Button>
            <Grid container>
              <Grid item>
                {/* <Link href="#" to = "/login" variant="body2">
                     Already have an account? Sign in
                  </Link> */}
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Toaster />
      </Container>
    </>
  );
}

export default Signup;

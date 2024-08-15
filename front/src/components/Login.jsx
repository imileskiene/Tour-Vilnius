import {
  Avatar,
  Box,
  Container,
  CssBaseline,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import { jwtDecode } from "jwt-decode";
function Login() {
  const login_url =
    import.meta.env.VITE_LOGIN || "http://localhost:3005/v1/users/login";
  const navigate = useNavigate();
  const { setToken } = useContext(AppContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    try {
      const { status, data } = await axios.post(login_url, values);
      if (status === 200) {
        const decoded = jwtDecode(data);
        // console.log(decoded);
        setToken(decoded);
        // console.log(data);
        window.localStorage.setItem("token", data);
        toast.success("Prisijungimas sėkmingas!");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        if (error.response.status === 400 || error.response.status === 401) {
          setFormError(
            error.response.data.message || "Invalid email or password"
          );
        } else {
          setFormError("An error occurred. Please try again later.");
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
            Prisijungti
          </Typography>
        </Box>
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
            Prisijungti
          </Button>
        </Box>
        <Toaster />
      </Container>
    </>
  );
}

export default Login;

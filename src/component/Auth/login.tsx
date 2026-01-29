import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {Box,Button,TextField,Typography,Paper,CircularProgress,IconButton,InputAdornment,Tabs,Tab,} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";
import { loginSuccess } from "../../store/authSlice";
import { toast } from "react-toastify";
import Footer from "../Footer";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [errorApi, setErrorApi] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Submit Function
  async function handleLogin(values: { email: string; password: string }) {
    try {
      setLoading(true);

      const { data } = await axios.post("https://node-hr.vercel.app/auth/login",values,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      localStorage.setItem("token", data.accessToken);
      dispatch(loginSuccess({ token: data.accessToken, user: data.user }));

      toast.success("Logged in successfully");
      navigate("/");
    } catch (err: any) {
      setErrorApi(err.response?.data?.message || "Login failed");
      toast.error(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  //Validation Schema
  const validationSchema = yup.object({
    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Too short"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleLogin,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.1, ease: "easeOut" }}
      style={{ width: "100%" }}
    >
      <Box sx={{display: "flex",justifyContent: "center",alignItems: "center",px: { lg: 10 },overflow: "hidden",minHeight: "80vh",}}>
        <Box sx={{ display: "flex" , pb : {md:4} ,py:{md:2}}}>
          {/* Left Side Hero */}
          <motion.div>
            <Box
              sx={{
                flex: { sx: "0 0 0%", md: "0 0 60%" },
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "center",
                background: "#202020",
                color: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                flexDirection: "column",
                textAlign: "center",
                p: 4,
                height: "640px",
              }}
            >
              <img src="https://www.bizlibrary.com/wp-content/uploads/2019/05/30141657/employeeretention.png"
                alt="Login Illustration"
                style={{ width: "100%", marginBottom: "2rem" }}
              />

              <Typography variant="h4" fontWeight="bold">
                Welcome Back 👋
              </Typography>

              <Typography
                variant="body1"
                sx={{ mt: 2, maxWidth: 400 }}
              >
                Sign in to continue and access your personalized dashboard.
              </Typography>
            </Box>
          </motion.div>

          {/* Right Side Form */}
          <Box sx={{flex: { xs: "0 0 100%", md: "0 0 40%" },display: "flex",alignItems: "center",justifyContent: "center",}}>
            <Paper sx={{p: 4,width: "100%",position: "relative",height: "640px",backgroundColor: "#2c2c2c",color: "#fff",}}>

              {/* Tabs */}
              <Tabs
                value={0}
                sx={{position: "absolute",top: 0,right: 0,
                  "& .MuiTab-root": {
                    textTransform: "none",
                    borderRadius: "0 0 8px 8px",
                    minWidth: 120,
                    color: "#eee",
                  },
                  "& .MuiTab-root.Mui-selected": {
                    backgroundColor: "#1976d2",
                    color: "#fff",
                  },
                  "& .MuiTabs-indicator": {
                    display: "none",
                  },
                }}
              >
                <Tab label="Sign In" />
                <Tab label="Register" component={Link} to="/register" />
              </Tabs>

              <Typography variant="h5" align="center" gutterBottom sx={{ pt: 10 }}>
                Login
              </Typography>

              <Typography variant="body2" align="center" mb={3}>
                Enter your credentials to continue
              </Typography>

              <form onSubmit={formik.handleSubmit}>
                {/* Email */}
                <TextField
                  fullWidth
                  margin="normal"
                  id="email"
                  name="email"
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.email &&
                    Boolean(formik.errors.email)
                  }
                  helperText={
                    formik.touched.email &&
                    formik.errors.email
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#fff",
                      },
                      "&:hover fieldset": {
                        borderColor: "#42a5f5",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#fff",
                    },
                    "& .MuiInputBase-input": {
                      color: "#fff",
                    },
                  }}
                />

                {/* Password */}
                <TextField
                  fullWidth
                  margin="normal"
                  id="password"
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password &&
                    Boolean(formik.errors.password)
                  }
                  helperText={
                    formik.touched.password &&
                    formik.errors.password
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#fff",
                      },
                      "&:hover fieldset": {
                        borderColor: "#42a5f5",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#fff",
                    },
                    "& .MuiInputBase-input": {
                      color: "#fff",
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowPassword(!showPassword)
                          }
                          edge="end"
                        >
                          {showPassword ? (
                            <Visibility sx={{ color: "white" }} />
                          ) : (
                            <VisibilityOff sx={{ color: "white" }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* API Error */}
                {errorApi && (
                  <Typography
                    color="error"
                    variant="body2"
                    mt={1}
                  >
                    {errorApi}
                  </Typography>
                )}

                {/* Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 3,
                    py: 1.2,
                    fontWeight: "bold",
                    borderRadius: 2,
                    background: loading
                      ? "#313131ff"
                      : "linear-gradient(135deg, #1976d2, #42a5f5)",
                  }}
                >
                  {loading ? (
                    <CircularProgress
                      size={24}
                      sx={{ color: "#1976d2" }}
                    />
                  ) : (
                    "Login"
                  )}
                </Button>

                {/* Links */}
                <Box mt={2} textAlign="center">
                  <Typography variant="body2">
                    Don’t have an account?{" "}
                    <Link
                      to="/register"
                      style={{
                        color: "#1976d2",
                        textDecoration: "none",
                      }}
                    >
                      Register
                    </Link>
                  </Typography>

                  <Typography variant="body2" mt={1}>
                    <Link
                      to="/forgotPassword"
                      style={{
                        color: "#1976d2",
                        textDecoration: "none",
                      }}
                    >
                      Forgot your password?
                    </Link>
                  </Typography>
                </Box>
              </form>
            </Paper>
          </Box>
        </Box>
      </Box>
      <Footer></Footer>
    </motion.div>
  );
}
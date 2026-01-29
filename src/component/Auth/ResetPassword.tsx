import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {Box,Button,TextField,Typography,Paper,CircularProgress,Tabs,Tab,} from "@mui/material";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Footer from "../Footer";

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [errorApi, setErrorApi] = useState("");
  const navigate = useNavigate();

  //Submit Function
  async function handleResetPassword(values: { newPassword: string }) {
    try {
      setLoading(true);
      const { data } = await axios.post("https://node-hr.vercel.app/auth/reset-password",
        {
          newPassword: values.newPassword,
        },
        { headers: { "Content-Type": "application/json" } },
      );
      toast.success("Password reset successfully");
      navigate("/");
    } catch (err: any) {
       toast.error(err.response?.data?.message || "Request failed");
      setErrorApi(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  //Validation Schema
  const validationSchema = yup.object({
    newPassword: yup
      .string()
      .required("New password is required")
  .min(6, "At least 6 characters"),
  });

  //Formik setup
  const formik = useFormik({
    initialValues: { newPassword: "" },
    validationSchema,
    onSubmit: handleResetPassword  })

  return <>
    <Box sx={{display: "flex",justifyContent: "center",alignItems: "center",px: { lg: 10 },overflow: "hidden",minHeight: "80vh",}}>

      <Box sx={{ display: "flex" , pb : {md:4} ,py:{md:2}}}>
        {/* Left Side Hero */}
        <motion.div>
          <Box sx={{flex: { sx: "0 0 0%", md: "0 0 60%" },display: { xs: "none", md: "flex" },alignItems: "center",justifyContent: "center",background: "#202020",color: "#fff",boxShadow: "0 4px 12px rgba(0,0,0,0.3)",flexDirection: "column",textAlign: "center",p: 4,height: "640px",}}>
            <img src="https://www.bizlibrary.com/wp-content/uploads/2019/05/30141657/employeeretention.png"
              alt="Login Illustration"
              style={{ width: "100%", marginBottom: "2rem" }}
            />
            <Typography variant="h4" fontWeight="bold">
              Welcome Back 👋
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, maxWidth: 400 }}>
              Sign in to continue and access your personalized dashboard.
            </Typography>
          </Box>
        </motion.div>


        {/* Right Side Form */}
        <Box sx={{flex: { xs: "0 0 100%", md: "0 0 40%" },display: "flex",alignItems: "center",justifyContent: "center"}}>
          <Paper sx={{p: 4,width: "100%",position: "relative",height: "640px",background: "#2c2c2c",}}>
            {/* Tabs */}
            <Tabs
              value={0}
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
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

            <Box sx={{ transform: "translateY(80px)" }}>
              <Typography
                variant="h5"
                align="center"
                color="white"
                gutterBottom
                sx={{ pt: 5 }}
              >
                Reset Password
              </Typography>
              <Typography variant="body2" align="center" color="white" mb={3}>
                Enter your new password
              </Typography>
            </Box>

            <form onSubmit={formik.handleSubmit}>
              {/* New Password */}
              <TextField
                fullWidth
                margin="normal"
                id="newPassword"
                name="newPassword"
                label="New Password"
                type="password"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                error={
                  formik.touched.newPassword &&
                  Boolean(formik.errors.newPassword)
                }
                helperText={
                  formik.touched.newPassword && formik.errors.newPassword
                }
                sx={{
                  transform: "translateY(80px)",
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

              <TextField fullWidth sx={{ visibility: "hidden" }} />

              {/* API Error */}
              {errorApi && (
                <Typography color="error" variant="body2" mt={1}>
                  {errorApi}
                </Typography>
              )}

              {/* Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  py: 1.2,
                  borderRadius: 2,
                  background: loading
                    ? "#313131ff"
                    : "linear-gradient(135deg, #1976d2, #42a5f5)",
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#1976d2" }} />
                ) : (
                  "Reset Password"
                )}
              </Button>

              {/* Links */}
              <Box mt={2} textAlign="center">
                <Typography variant="body2" color="white">
                  Don’t have an account?{" "}
                  <Link
                    to="/register"
                    style={{ color: "#1976d2", textDecoration: "none" }}
                  >
                    Register
                  </Link>
                </Typography>
              </Box>
            </form>
          </Paper>
        </Box>
      </Box>
    </Box>
    <Footer></Footer>
    </>
}

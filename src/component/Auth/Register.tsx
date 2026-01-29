import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {Box,Button, TextField,Typography,Paper,CircularProgress,MenuItem,Tabs,Tab,InputAdornment,IconButton,} from "@mui/material";
import { motion } from "framer-motion";
import { loginSuccess } from "../../store/authSlice";
import { toast } from "react-toastify";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { MuiTelInput } from 'mui-tel-input';
import Footer from "../Footer";

//  Validation Schema
const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().required("Email is required").email("Invalid email"),
  password: yup.string().required("Password is required").min(6, "Too short"),
  phone: yup.string().required("Phone is required"),
  role: yup.string().required("Role is required"),
});

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [errorApi, setErrorApi] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleRegister(values: any) {
    try {
      setLoading(true);
     const { data } = await axios.post("https://node-hr.vercel.app/auth/register",
        values,
        { headers: { "Content-Type": "application/json" } }
      );
      localStorage.setItem("token", data.accessToken);
      dispatch(loginSuccess({ token: data.accessToken, user: data.user }));
      toast.success("Account created successfully ");
      navigate("/");
    } catch (err: any) {
      setErrorApi(err.response?.data?.message || "Register failed");
      toast.error(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", phone: "", role: "" },
    validationSchema,
    onSubmit: handleRegister,
  });

  return <>
    <Box  sx={{display: "flex",justifyContent :'center',alignItems : 'center',px:{lg:10},overflow:'hidden'}}>
    <Box sx={{display: "flex",pb : {md:4} ,py:{md:2}}}
    >
      {/* Left Side Hero */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{display: "flex",alignItems: "center",justifyContent: "center",backgroundColor: "#202020",color: "#ffffffff",boxShadow:" 0 4px 12px rgba(0,0,0,0.3)"}}>
        <Box sx={{display: { xs: "none", md: "flex" },flexDirection: "column",alignItems: "center",textAlign: "center",p: 4,}}>

          <img src="https://www.bizlibrary.com/wp-content/uploads/2019/05/30141657/employeeretention.png"
            alt="Register Illustration"
            style={{ width: "100%", marginBottom: "2rem" }}
          />
          <Typography variant="h4" fontWeight="bold">
            Welcome to Our Platform 
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, maxWidth: 400 }}>
            Join us today and explore premium features designed to make your
            journey easier.
          </Typography>
        </Box>
      </motion.div>


      {/* Right Side Form */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
       style={{display: "flex",alignItems: "center",justifyContent: "center",}}>
        <Paper sx={{p: 4,width: "100%",maxWidth: 650,position: 'relative',  backgroundColor: "#2c2c2c"}}>

          {/* Tabs */}
         <Tabs
        value={1}
          sx={{
          position: 'absolute',
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
            color: "#fff",   // هنا هيغير لون الخط للأبيض
          },
          "& .MuiTabs-indicator": {
            display: "none",
          },
        }}
      >
  <Tab label="Sign In" component={Link} to="/login" />
  <Tab label="Register" />
</Tabs>

          <Typography variant="h5" align="center" gutterBottom sx={{pt:4, color:'white'}}>
            Create Account
          </Typography>
          <Typography
            variant="body2"
            align="center"
            mb={3}
            color="white"
          >
            Fill in your details to get started
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              id="name"
              name="name"
              label="Full Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
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

            <TextField
              fullWidth
              margin="normal"
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
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

                  <TextField
                fullWidth
                margin="normal"
                id="password"
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"} 
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
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
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <Visibility sx={{color : 'white'}}/> : <VisibilityOff  sx={{color : 'white'}}/>}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
                
                <MuiTelInput
                  fullWidth
                  margin="normal"
                  label="Phone"
                  defaultCountry="EG" 
                  value={formik.values.phone}
                  onChange={(phone) => formik.setFieldValue('phone', phone)}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
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
            <TextField
              select
              fullWidth
              margin="normal"
              id="role"
              name="role"
              label="Role"
              value={formik.values.role}
              onChange={formik.handleChange}
              error={formik.touched.role && Boolean(formik.errors.role)}
              helperText={formik.touched.role && formik.errors.role}
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
            >
              <MenuItem value="SEEKER">Seeker</MenuItem>
            </TextField>

            {errorApi && (
              <Typography color="error" variant="body2" mt={1}>
                {errorApi}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                py: 1.2,
                 borderRadius: 2, 
                background: loading ?  '#313131ff' : "linear-gradient(135deg, #1976d2, #42a5f5)"
                 
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} sx={{color : '#1976d2'}}  />
              ) : (
                "Register"
              )}
            </Button>

            <Box mt={2} textAlign="center">
              <Typography color="white" variant="body2">
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{ color: "#1976d2", textDecoration: "none" }}
                >
                  Login
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </motion.div>
    </Box>
   </Box>
             <Footer></Footer>
              </>
}
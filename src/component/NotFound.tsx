// NotFoundPage.tsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#121212",
        color: "#fff",
        textAlign: "center",
        p: 3,
      }}
    >
      <Typography
        variant="h1"
        component={motion.h1}
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
        sx={{ fontWeight: 800, fontSize: { xs: "4rem", md: "6rem" }, color: "#1f78ff" }}
      >
        404
      </Typography>

      <Typography
        variant="h5"
        sx={{ mt: 2, mb: 1, fontWeight: 600 }}
      >
        Page Not Found
      </Typography>

      <Typography
        variant="body1"
        sx={{ maxWidth: 500, mb: 4, color: "#aaa" }}
      >
        The page you’re looking for doesn’t exist or has been moved.
      </Typography>

      <Button
        variant="contained"
        sx={{
          background: "#1f78ff",
          borderRadius: 3,
          px: 4,
          py: 1.5,
          fontWeight: 400,
          "&:hover": { background: "#1f78ffcc" },
        }}
        onClick={() => navigate("/")}
      >
        Back to Home
      </Button>
    </Box>
  );
}
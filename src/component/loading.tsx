// src/components/common/Loading.tsx
import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const primaryBlue = "#3B82F6";
const textPrimary = "#E5E7EB";

export default function Loading() {
  return (
    <Box
      sx={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
       }}
    >
      {/* Spinner */}
      <CircularProgress
        size={50}
        thickness={4}
        sx={{
          color: primaryBlue,
          mb: 3,
          animation: "spin 1.5s linear infinite",
          "@keyframes spin": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      />

      {/* Text */}
      <Typography
        variant="h6"
        color={textPrimary}
        fontWeight={300}
        sx={{ letterSpacing: 1 }}
      >
        Loading your dashboard...
      </Typography>
    </Box>
  );
}
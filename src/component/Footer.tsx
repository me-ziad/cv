import React from "react";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 2,
        bgcolor: "#121212",
        color:'white',
        borderTop: "1px solid #ddd",
        position: "relative",
        bottom: 0,
        width: "100%",
      }}
    >
      {/* English */}
      <Typography variant="body2" color="white">
        © 2025 ziad. ziad rights reserved.
      </Typography>

      {/* Arabic */}
      <Typography variant="body2" color="white" sx={{ fontFamily: "Tahoma" }}>
        © 2025 جميع الحقوق محفوظة.
      </Typography>
    </Box>
  );
}
"use client";

import { Box, Typography } from "@mui/material";

export default function AuthFooter({ title, description }: { title: string; description: string }) {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 64,
        left: 32,
        right: 32,
        color: "white",
        zIndex: 2, // Place above overlay
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
        {title}
      </Typography>
      <Typography variant="body1" paragraph>
        {description}
      </Typography>

      {/* Dots navigation */}
      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
        <Box sx={{ width: 24, height: 4, bgcolor: "white", borderRadius: 2 }}></Box>
        <Box
          sx={{
            width: 4,
            height: 4,
            bgcolor: "white",
            borderRadius: "50%",
          }}
        ></Box>
        <Box
          sx={{
            width: 4,
            height: 4,
            bgcolor: "white",
            borderRadius: "50%",
          }}
        ></Box>
      </Box>
    </Box>
  );
}
